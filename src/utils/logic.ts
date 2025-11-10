import { UserInputs, PortfolioPlan, AssetAllocation, ActionPlanItem, GoalBucket, Debt } from '../types';

/**
 * Calculate risk score from quiz answers (0-100)
 */
export function calculateRiskScore(answers: Record<string, number>): number {
  const values = Object.values(answers);
  if (values.length === 0) return 50; // Default middle
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  const avg = sum / values.length;
  return Math.round((avg / 10) * 100);
}

/**
 * Map risk score to risk profile name
 */
export function getRiskProfile(riskScore: number): string {
  if (riskScore <= 20) return 'Very Conservative';
  if (riskScore <= 40) return 'Conservative';
  if (riskScore <= 60) return 'Balanced';
  if (riskScore <= 80) return 'Growth';
  return 'Aggressive';
}

/**
 * Calculate asset allocation based on risk score and age
 */
export function calculateAssetAllocation(riskScore: number, age: number): { equity: number; bond: number } {
  let equity: number;
  let bond: number;

  if (riskScore <= 20) {
    equity = 35;
    bond = 65;
  } else if (riskScore <= 40) {
    equity = 55;
    bond = 45;
  } else if (riskScore <= 60) {
    equity = 65;
    bond = 35;
  } else if (riskScore <= 80) {
    equity = 85;
    bond = 15;
  } else {
    equity = 92;
    bond = 8;
  }

  // Age guardrails
  if (age < 30 && equity < 30 && riskScore > 20) {
    equity = 30;
    bond = 70;
  }
  if (equity > 95) {
    equity = 95;
    bond = 5;
  }
  if (equity < 30) {
    equity = 30;
    bond = 70;
  }

  return { equity, bond };
}

/**
 * Calculate target emergency fund months
 */
export function getTargetEmergencyFundMonths(variableIncome: boolean, hasDebt: boolean): number {
  if (variableIncome) return 6;
  if (hasDebt) return 3;
  return 3;
}

/**
 * Check if debt has high APR (>= 8%)
 */
export function isHighInterestDebt(debt: Debt): boolean {
  return debt.apr >= 8;
}

/**
 * Calculate debt payoff timeline (months) using avalanche method
 */
export function calculateDebtPayoff(
  debt: Debt,
  monthlyPayment: number
): number {
  if (monthlyPayment <= debt.minPayment) {
    return Math.ceil(debt.balance / debt.minPayment);
  }
  
  const monthlyRate = debt.apr / 100 / 12;
  if (monthlyRate === 0) {
    return Math.ceil(debt.balance / monthlyPayment);
  }
  
  // Using amortization formula
  const months = -Math.log(1 - (debt.balance * monthlyRate) / monthlyPayment) / Math.log(1 + monthlyRate);
  return Math.ceil(months);
}

/**
 * Generate portfolio plan from user inputs
 */
export function generatePortfolioPlan(inputs: UserInputs): PortfolioPlan {
  const riskScore = calculateRiskScore(inputs.riskQuizAnswers);
  const riskProfile = getRiskProfile(riskScore);
  const { equity, bond } = calculateAssetAllocation(riskScore, inputs.age);
  
  const targetEmergencyMonths = getTargetEmergencyFundMonths(
    inputs.variableIncome,
    inputs.debts.length > 0
  );
  
  const highInterestDebts = inputs.debts.filter(isHighInterestDebt).sort((a, b) => b.apr - a.apr);
  const hasHighInterestDebt = highInterestDebts.length > 0;
  
  // Calculate available monthly investment
  let availableMonthly = inputs.maxMonthlyInvest;
  const actionPlan: ActionPlanItem[] = [];
  let priority = 1;
  
  // 1. Emergency fund top-up
  const emergencyDeficit = Math.max(0, targetEmergencyMonths - inputs.emergencyFundMonths);
  const monthlyEmergencyTopUp = emergencyDeficit > 0 
    ? (inputs.monthlyExpenses * emergencyDeficit) / 6 // Spread over 6 months
    : 0;
  
  if (monthlyEmergencyTopUp > 0) {
    actionPlan.push({
      priority: priority++,
      title: 'Build Emergency Fund',
      description: `Save ${targetEmergencyMonths} months of expenses (${emergencyDeficit} months remaining)`,
      monthlyAmount: monthlyEmergencyTopUp,
      timeline: `${Math.ceil(emergencyDeficit * inputs.monthlyExpenses / monthlyEmergencyTopUp)} months`,
    });
    availableMonthly -= monthlyEmergencyTopUp;
  }
  
  // 2. Employer match (if applicable)
  let employerMatchMonthly = 0;
  if (inputs.employerPlan.hasPlan && inputs.employerPlan.matchPercent && inputs.employerPlan.matchOfSalary) {
    const grossAnnual = inputs.netMonthlyIncome * 12 / 0.7; // Rough estimate
    const matchLimit = (inputs.employerPlan.matchOfSalary / 100) * grossAnnual;
    employerMatchMonthly = Math.min(matchLimit / 12, availableMonthly);
    
    if (employerMatchMonthly > 0) {
      actionPlan.push({
        priority: priority++,
        title: 'Capture Employer Match',
        description: `Contribute to ${inputs.employerPlan.matchPercent}% match`,
        monthlyAmount: employerMatchMonthly,
      });
      availableMonthly -= employerMatchMonthly;
    }
  }
  
  // 3. High-interest debt payoff
  let debtPayoffMonthly = 0;
  let debtPriority: PortfolioPlan['debtPriority'] = undefined;
  
  if (hasHighInterestDebt && availableMonthly > 0) {
    const topDebt = highInterestDebts[0];
    debtPayoffMonthly = Math.min(
      topDebt.balance / 12, // Pay off in ~12 months if possible
      availableMonthly * 0.5, // Use up to 50% of remaining
      topDebt.balance
    );
    
    const payoffMonths = calculateDebtPayoff(topDebt, topDebt.minPayment + debtPayoffMonthly);
    debtPriority = {
      debt: topDebt,
      payoffMonths,
      monthlyPayment: topDebt.minPayment + debtPayoffMonthly,
    };
    
    actionPlan.push({
      priority: priority++,
      title: `Pay Off ${topDebt.type} Debt`,
      description: `APR ${topDebt.apr}% - Best risk-free return`,
      monthlyAmount: debtPayoffMonthly,
      timeline: `${payoffMonths} months`,
    });
    availableMonthly -= debtPayoffMonthly;
  }
  
  // 4. Allocate remaining to investments
  const investableMonthly = Math.max(0, availableMonthly);
  
  // Generate allocations
  const allocations: AssetAllocation[] = [];
  
  // Long-term allocations (for retirement and long-term goals)
  const longTermMonthly = inputs.goalsLong.length > 0 
    ? investableMonthly * 0.7 
    : investableMonthly;
  
  if (longTermMonthly > 0) {
    const usEquityMonthly = (longTermMonthly * equity / 100) * 0.7;
    const intlEquityMonthly = (longTermMonthly * equity / 100) * 0.3;
    const bondMonthly = longTermMonthly * bond / 100;
    
    if (usEquityMonthly > 0) {
      allocations.push({
        label: 'US Total Stock Market',
        ticker: 'VTI',
        percentage: (usEquityMonthly / investableMonthly) * 100,
        monthlyDollars: usEquityMonthly,
        explanation: 'Broad US market exposure with low fees. Diversified across all company sizes.',
      });
    }
    
    if (intlEquityMonthly > 0) {
      allocations.push({
        label: 'International Stock Market',
        ticker: 'VXUS',
        percentage: (intlEquityMonthly / investableMonthly) * 100,
        monthlyDollars: intlEquityMonthly,
        explanation: 'Global diversification reduces risk. International markets can perform differently than US markets.',
      });
    }
    
    if (bondMonthly > 0) {
      allocations.push({
        label: 'US Total Bond Market',
        ticker: 'BND',
        percentage: (bondMonthly / investableMonthly) * 100,
        monthlyDollars: bondMonthly,
        explanation: 'Provides stability and income. Bonds typically move opposite to stocks, reducing portfolio volatility.',
      });
    }
  }
  
  // Short-term goal buckets
  const goalBuckets: GoalBucket[] = [];
  const shortTermMonthly = investableMonthly - longTermMonthly;
  
  inputs.goalsShort.forEach(goal => {
    const monthsToGoal = Math.ceil(
      (new Date(goal.targetDateISO).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)
    );
    
    const isShortTerm = monthsToGoal <= 36;
    const cashPercentage = isShortTerm ? 90 : 60;
    const bondPercentage = 100 - cashPercentage;
    
    const goalMonthly = shortTermMonthly / Math.max(1, inputs.goalsShort.length);
    
    const goalAllocations: AssetAllocation[] = [];
    
    if (cashPercentage > 0) {
      goalAllocations.push({
        label: 'High-Yield Savings / Money Market',
        percentage: cashPercentage,
        monthlyDollars: goalMonthly * (cashPercentage / 100),
        explanation: `Safe, liquid cash for goals within ${monthsToGoal} months. Avoids market volatility.`,
      });
    }
    
    if (bondPercentage > 0 && monthsToGoal > 18) {
      goalAllocations.push({
        label: 'Short-Term Bonds',
        ticker: 'SGOV',
        percentage: bondPercentage,
        monthlyDollars: goalMonthly * (bondPercentage / 100),
        explanation: 'Slightly higher return than cash with minimal risk for goals 18+ months away.',
      });
    }
    
    goalBuckets.push({
      goalName: goal.name,
      targetAmount: goal.targetAmount,
      currentAllocation: goalAllocations,
      fundingProgress: 0,
      explanation: `Allocated for ${goal.name} due in ${monthsToGoal} months. ${goal.mustHave ? 'Must-have goal - prioritizing safety.' : 'Nice-to-have goal - can accept some risk.'}`,
    });
  });
  
  // Add investment contributions to action plan
  if (investableMonthly > 0) {
    actionPlan.push({
      priority: priority++,
      title: 'Monthly Investment Contributions',
      description: 'Automated contributions to diversified index funds',
      monthlyAmount: investableMonthly,
    });
  }
  
  return {
    riskScore,
    riskProfile,
    equityPercentage: equity,
    bondPercentage: bond,
    allocations,
    goalBuckets,
    actionPlan,
    emergencyFundStatus: {
      currentMonths: inputs.emergencyFundMonths,
      targetMonths: targetEmergencyMonths,
      monthlyTopUp: monthlyEmergencyTopUp,
    },
    debtPriority,
  };
}

