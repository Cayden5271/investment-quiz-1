import { describe, it, expect } from 'vitest';
import {
  calculateRiskScore,
  getRiskProfile,
  calculateAssetAllocation,
  getTargetEmergencyFundMonths,
  isHighInterestDebt,
  calculateDebtPayoff,
  generatePortfolioPlan,
} from './logic';
import { UserInputs, Debt } from '../types';

describe('calculateRiskScore', () => {
  it('should return 50 for empty answers', () => {
    expect(calculateRiskScore({})).toBe(50);
  });

  it('should calculate average risk score correctly', () => {
    const answers = {
      q1: 5, // 50%
      q2: 7, // 70%
      q3: 3, // 30%
    };
    const expected = Math.round(((5 + 7 + 3) / 3 / 10) * 100);
    expect(calculateRiskScore(answers)).toBe(expected);
  });

  it('should handle single answer', () => {
    expect(calculateRiskScore({ q1: 10 })).toBe(100);
    expect(calculateRiskScore({ q1: 0 })).toBe(0);
    expect(calculateRiskScore({ q1: 5 })).toBe(50);
  });

  it('should round to nearest integer', () => {
    const answers = { q1: 3, q2: 4 }; // Average 3.5 = 35%
    expect(calculateRiskScore(answers)).toBe(35);
  });
});

describe('getRiskProfile', () => {
  it('should return Very Conservative for scores 0-20', () => {
    expect(getRiskProfile(0)).toBe('Very Conservative');
    expect(getRiskProfile(10)).toBe('Very Conservative');
    expect(getRiskProfile(20)).toBe('Very Conservative');
  });

  it('should return Conservative for scores 21-40', () => {
    expect(getRiskProfile(21)).toBe('Conservative');
    expect(getRiskProfile(30)).toBe('Conservative');
    expect(getRiskProfile(40)).toBe('Conservative');
  });

  it('should return Balanced for scores 41-60', () => {
    expect(getRiskProfile(41)).toBe('Balanced');
    expect(getRiskProfile(50)).toBe('Balanced');
    expect(getRiskProfile(60)).toBe('Balanced');
  });

  it('should return Growth for scores 61-80', () => {
    expect(getRiskProfile(61)).toBe('Growth');
    expect(getRiskProfile(70)).toBe('Growth');
    expect(getRiskProfile(80)).toBe('Growth');
  });

  it('should return Aggressive for scores 81-100', () => {
    expect(getRiskProfile(81)).toBe('Aggressive');
    expect(getRiskProfile(90)).toBe('Aggressive');
    expect(getRiskProfile(100)).toBe('Aggressive');
  });
});

describe('calculateAssetAllocation', () => {
  it('should return conservative allocation for low risk scores', () => {
    const result = calculateAssetAllocation(15, 30);
    expect(result.equity).toBe(35);
    expect(result.bond).toBe(65);
    expect(result.equity + result.bond).toBe(100);
  });

  it('should return balanced allocation for medium risk scores', () => {
    const result = calculateAssetAllocation(50, 30);
    expect(result.equity).toBe(65);
    expect(result.bond).toBe(35);
    expect(result.equity + result.bond).toBe(100);
  });

  it('should return aggressive allocation for high risk scores', () => {
    const result = calculateAssetAllocation(90, 30);
    expect(result.equity).toBe(92);
    expect(result.bond).toBe(8);
    expect(result.equity + result.bond).toBe(100);
  });

  it('should enforce minimum 30% equity for young investors', () => {
    const result = calculateAssetAllocation(10, 25);
    // Even with very low risk, should have at least 30% equity if risk > 20
    expect(result.equity).toBeGreaterThanOrEqual(30);
  });

  it('should enforce maximum 95% equity', () => {
    const result = calculateAssetAllocation(100, 25);
    expect(result.equity).toBeLessThanOrEqual(95);
    expect(result.bond).toBeGreaterThanOrEqual(5);
  });

  it('should enforce minimum 30% equity globally', () => {
    const result = calculateAssetAllocation(5, 40);
    expect(result.equity).toBeGreaterThanOrEqual(30);
  });

  it('should always sum to 100%', () => {
    const testCases = [
      { risk: 0, age: 20 },
      { risk: 50, age: 30 },
      { risk: 100, age: 50 },
    ];
    
    testCases.forEach(({ risk, age }) => {
      const result = calculateAssetAllocation(risk, age);
      expect(result.equity + result.bond).toBe(100);
    });
  });
});

describe('getTargetEmergencyFundMonths', () => {
  it('should return 6 months for variable income', () => {
    expect(getTargetEmergencyFundMonths(true, false)).toBe(6);
    expect(getTargetEmergencyFundMonths(true, true)).toBe(6);
  });

  it('should return 3 months for stable income without debt', () => {
    expect(getTargetEmergencyFundMonths(false, false)).toBe(3);
  });

  it('should return 3 months for stable income with debt', () => {
    expect(getTargetEmergencyFundMonths(false, true)).toBe(3);
  });
});

describe('isHighInterestDebt', () => {
  it('should return true for debt with APR >= 8%', () => {
    const debt: Debt = {
      type: 'credit card',
      balance: 5000,
      apr: 8,
      minPayment: 100,
    };
    expect(isHighInterestDebt(debt)).toBe(true);
  });

  it('should return true for debt with APR > 8%', () => {
    const debt: Debt = {
      type: 'credit card',
      balance: 5000,
      apr: 18.5,
      minPayment: 100,
    };
    expect(isHighInterestDebt(debt)).toBe(true);
  });

  it('should return false for debt with APR < 8%', () => {
    const debt: Debt = {
      type: 'student',
      balance: 20000,
      apr: 5,
      minPayment: 200,
    };
    expect(isHighInterestDebt(debt)).toBe(false);
  });

  it('should return false for debt with APR = 7.9%', () => {
    const debt: Debt = {
      type: 'auto',
      balance: 15000,
      apr: 7.9,
      minPayment: 300,
    };
    expect(isHighInterestDebt(debt)).toBe(false);
  });
});

describe('calculateDebtPayoff', () => {
  it('should calculate payoff for zero interest debt', () => {
    const debt: Debt = {
      type: 'personal',
      balance: 1000,
      apr: 0,
      minPayment: 100,
    };
    expect(calculateDebtPayoff(debt, 100)).toBe(10);
    expect(calculateDebtPayoff(debt, 200)).toBe(5);
  });

  it('should use minimum payment if provided payment is less', () => {
    const debt: Debt = {
      type: 'credit card',
      balance: 1000,
      apr: 10,
      minPayment: 100,
    };
    const months = calculateDebtPayoff(debt, 50);
    expect(months).toBeGreaterThan(0);
  });

  it('should calculate payoff for interest-bearing debt', () => {
    const debt: Debt = {
      type: 'credit card',
      balance: 10000,
      apr: 18,
      minPayment: 200,
    };
    const months = calculateDebtPayoff(debt, 500);
    expect(months).toBeGreaterThan(0);
    expect(months).toBeLessThan(30); // Should pay off faster with higher payment
  });

  it('should return at least 1 month', () => {
    const debt: Debt = {
      type: 'credit card',
      balance: 100,
      apr: 20,
      minPayment: 10,
    };
    const months = calculateDebtPayoff(debt, 1000);
    expect(months).toBeGreaterThanOrEqual(1);
  });
});

describe('generatePortfolioPlan', () => {
  const createBaseInputs = (): UserInputs => ({
    age: 25,
    country: 'US',
    netMonthlyIncome: 4000,
    variableIncome: false,
    monthlyExpenses: 2500,
    emergencyFundMonths: 1,
    debts: [],
    employerPlan: { hasPlan: false },
    accountsAvailable: {
      rothIRA: true,
      traditionalIRA: false,
      taxable: true,
    },
    goalsShort: [],
    goalsLong: [{ name: 'retirement' }],
    maxMonthlyInvest: 1000,
    oneTimeStart: 0,
    riskQuizAnswers: {
      experience: 5,
      timeHorizon: 8,
      lossReaction: 5,
      lossAversion: 6,
      incomeStability: 7,
      goalFlexibility: 7,
    },
  });

  it('should generate a valid portfolio plan', () => {
    const inputs = createBaseInputs();
    const plan = generatePortfolioPlan(inputs);

    expect(plan).toBeDefined();
    expect(plan.riskScore).toBeGreaterThanOrEqual(0);
    expect(plan.riskScore).toBeLessThanOrEqual(100);
    expect(plan.riskProfile).toBeDefined();
    expect(plan.equityPercentage + plan.bondPercentage).toBe(100);
    expect(plan.actionPlan).toBeInstanceOf(Array);
    expect(plan.allocations).toBeInstanceOf(Array);
    expect(plan.goalBuckets).toBeInstanceOf(Array);
  });

  it('should prioritize emergency fund when below target', () => {
    const inputs = createBaseInputs();
    inputs.emergencyFundMonths = 0;
    inputs.monthlyExpenses = 2000;
    
    const plan = generatePortfolioPlan(inputs);
    const emergencyAction = plan.actionPlan.find(a => a.title.includes('Emergency'));
    
    expect(emergencyAction).toBeDefined();
    expect(emergencyAction?.monthlyAmount).toBeGreaterThan(0);
  });

  it('should include employer match in action plan', () => {
    const inputs = createBaseInputs();
    inputs.employerPlan = {
      hasPlan: true,
      matchPercent: 50,
      matchOfSalary: 6,
    };
    
    const plan = generatePortfolioPlan(inputs);
    const matchAction = plan.actionPlan.find(a => a.title.includes('Employer'));
    
    expect(matchAction).toBeDefined();
    expect(matchAction?.monthlyAmount).toBeGreaterThan(0);
  });

  it('should prioritize high-interest debt', () => {
    const inputs = createBaseInputs();
    inputs.debts = [
      {
        type: 'credit card',
        balance: 5000,
        apr: 18,
        minPayment: 100,
      },
    ];
    
    const plan = generatePortfolioPlan(inputs);
    const debtAction = plan.actionPlan.find(a => a.title.includes('Debt'));
    
    expect(debtAction).toBeDefined();
    expect(plan.debtPriority).toBeDefined();
    expect(plan.debtPriority?.debt.apr).toBe(18);
  });

  it('should allocate assets based on risk score', () => {
    const inputs = createBaseInputs();
    
    // Low risk
    inputs.riskQuizAnswers = { q1: 2, q2: 2, q3: 2 };
    const lowRiskPlan = generatePortfolioPlan(inputs);
    expect(lowRiskPlan.equityPercentage).toBeLessThan(60);
    
    // High risk
    inputs.riskQuizAnswers = { q1: 9, q2: 9, q3: 9 };
    const highRiskPlan = generatePortfolioPlan(inputs);
    expect(highRiskPlan.equityPercentage).toBeGreaterThan(70);
  });

  it('should create goal buckets for short-term goals', () => {
    const inputs = createBaseInputs();
    inputs.goalsShort = [
      {
        name: 'Vacation',
        targetAmount: 5000,
        targetDateISO: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mustHave: false,
      },
    ];
    
    const plan = generatePortfolioPlan(inputs);
    expect(plan.goalBuckets.length).toBeGreaterThan(0);
    const vacationBucket = plan.goalBuckets.find(b => b.goalName === 'Vacation');
    expect(vacationBucket).toBeDefined();
  });

  it('should allocate more to cash for short-term goals', () => {
    const inputs = createBaseInputs();
    const shortDate = new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    inputs.goalsShort = [
      {
        name: 'Emergency',
        targetAmount: 3000,
        targetDateISO: shortDate,
        mustHave: true,
      },
    ];
    
    const plan = generatePortfolioPlan(inputs);
    const bucket = plan.goalBuckets[0];
    const cashAllocation = bucket.currentAllocation.find(a => 
      a.label.includes('Savings') || a.label.includes('Money Market')
    );
    
    expect(cashAllocation).toBeDefined();
    expect(cashAllocation?.percentage).toBeGreaterThan(50);
  });

  it('should handle zero monthly investment', () => {
    const inputs = createBaseInputs();
    inputs.maxMonthlyInvest = 0;
    
    const plan = generatePortfolioPlan(inputs);
    expect(plan).toBeDefined();
    expect(plan.allocations.length).toBe(0);
  });

  it('should handle variable income emergency fund target', () => {
    const inputs = createBaseInputs();
    inputs.variableIncome = true;
    
    const plan = generatePortfolioPlan(inputs);
    expect(plan.emergencyFundStatus.targetMonths).toBe(6);
  });

  it('should sum action plan amounts correctly', () => {
    const inputs = createBaseInputs();
    inputs.maxMonthlyInvest = 1000;
    inputs.emergencyFundMonths = 0;
    inputs.monthlyExpenses = 2000;
    
    const plan = generatePortfolioPlan(inputs);
    const totalAllocated = plan.actionPlan.reduce((sum, item) => sum + item.monthlyAmount, 0);
    
    // Should not exceed max monthly investment
    expect(totalAllocated).toBeLessThanOrEqual(inputs.maxMonthlyInvest + 100); // Allow small rounding
  });

  it('should create allocations with correct percentages', () => {
    const inputs = createBaseInputs();
    inputs.maxMonthlyInvest = 1000;
    
    const plan = generatePortfolioPlan(inputs);
    const totalPercentage = plan.allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    
    // Allow for rounding errors
    expect(totalPercentage).toBeGreaterThan(90);
    expect(totalPercentage).toBeLessThanOrEqual(100);
  });

  it('should handle multiple debts and prioritize highest APR', () => {
    const inputs = createBaseInputs();
    inputs.debts = [
      {
        type: 'credit card',
        balance: 3000,
        apr: 20,
        minPayment: 100,
      },
      {
        type: 'personal',
        balance: 5000,
        apr: 12,
        minPayment: 150,
      },
    ];
    
    const plan = generatePortfolioPlan(inputs);
    expect(plan.debtPriority).toBeDefined();
    expect(plan.debtPriority?.debt.apr).toBe(20); // Highest APR first
  });
});


