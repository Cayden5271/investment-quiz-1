export interface Debt {
  type: 'credit card' | 'student' | 'auto' | 'personal' | 'mortgage' | 'other';
  balance: number;
  apr: number;
  minPayment: number;
}

export interface EmployerPlan {
  hasPlan: boolean;
  matchPercent?: number;
  matchOfSalary?: number;
}

export interface AccountsAvailable {
  rothIRA: boolean;
  traditionalIRA: boolean;
  taxable: boolean;
}

export interface ShortTermGoal {
  name: string;
  targetAmount: number;
  targetDateISO: string;
  mustHave: boolean;
}

export interface LongTermGoal {
  name: 'retirement' | 'home' | 'education' | 'other';
  targetAmount?: number;
  targetDateISO?: string;
}

export interface UserInputs {
  age: number;
  country: 'US' | 'Other';
  netMonthlyIncome: number;
  variableIncome: boolean;
  monthlyExpenses: number;
  emergencyFundMonths: number;
  debts: Debt[];
  employerPlan: EmployerPlan;
  accountsAvailable: AccountsAvailable;
  goalsShort: ShortTermGoal[];
  goalsLong: LongTermGoal[];
  maxMonthlyInvest: number;
  oneTimeStart: number;
  riskQuizAnswers: Record<string, number>;
}

export interface AssetAllocation {
  label: string;
  ticker?: string;
  percentage: number;
  monthlyDollars: number;
  explanation: string;
}

export interface GoalBucket {
  goalName: string;
  targetAmount: number;
  currentAllocation: AssetAllocation[];
  fundingProgress: number;
  explanation: string;
}

export interface ActionPlanItem {
  priority: number;
  title: string;
  description: string;
  monthlyAmount: number;
  timeline?: string;
}

export interface PortfolioPlan {
  riskScore: number;
  riskProfile: string;
  equityPercentage: number;
  bondPercentage: number;
  allocations: AssetAllocation[];
  goalBuckets: GoalBucket[];
  actionPlan: ActionPlanItem[];
  emergencyFundStatus: {
    currentMonths: number;
    targetMonths: number;
    monthlyTopUp: number;
  };
  debtPriority?: {
    debt: Debt;
    payoffMonths: number;
    monthlyPayment: number;
  };
}

