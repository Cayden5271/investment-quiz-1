import { AssetAllocation } from '../types';

/**
 * Pure function to calculate US/International equity split
 * Default: 70% US / 30% International
 * Allowed range: 60/40 to 80/20
 */
export function calculateEquitySplit(
  totalEquity: number,
  usInternationalRatio: number = 0.7
): { us: number; international: number } {
  // Clamp ratio between 0.6 and 0.8
  const clampedRatio = Math.max(0.6, Math.min(0.8, usInternationalRatio));
  
  return {
    us: totalEquity * clampedRatio,
    international: totalEquity * (1 - clampedRatio),
  };
}

/**
 * Pure function to calculate bond allocation split
 * Default: 80% total bond / 20% short-term Treasuries
 */
export function calculateBondSplit(
  totalBonds: number,
  shortTermRatio: number = 0.2
): { totalBond: number; shortTerm: number } {
  const clampedRatio = Math.max(0, Math.min(0.5, shortTermRatio));
  
  return {
    totalBond: totalBonds * (1 - clampedRatio),
    shortTerm: totalBonds * clampedRatio,
  };
}

/**
 * Pure function to calculate monthly allocation dollars
 * Ensures percentages sum to 100% and distributes monthly amount accordingly
 */
export function calculateMonthlyAllocations(
  monthlyAmount: number,
  percentages: Array<{ label: string; percentage: number }>
): AssetAllocation[] {
  // Normalize percentages to sum to 100%
  const totalPercentage = percentages.reduce((sum, p) => sum + p.percentage, 0);
  const normalizedPercentages = totalPercentage > 0
    ? percentages.map(p => ({ ...p, percentage: (p.percentage / totalPercentage) * 100 }))
    : percentages;

  return normalizedPercentages.map(({ label, percentage }) => ({
    label,
    percentage,
    monthlyDollars: (monthlyAmount * percentage) / 100,
    explanation: '',
  }));
}

/**
 * Pure function to determine short-term goal allocation
 * Returns cash/bond split based on timeline and must-have status
 */
export function calculateShortTermAllocation(
  monthsToGoal: number,
  mustHave: boolean
): { cash: number; bonds: number } {
  // Must-have goals within 2 years: 100% cash
  if (mustHave && monthsToGoal <= 24) {
    return { cash: 100, bonds: 0 };
  }

  // Goals within 18 months: 90% cash, 10% bonds
  if (monthsToGoal <= 18) {
    return { cash: 90, bonds: 10 };
  }

  // Goals 18-36 months: 60% cash, 40% bonds
  if (monthsToGoal <= 36) {
    return { cash: 60, bonds: 40 };
  }

  // Beyond 36 months: treat as long-term
  return { cash: 0, bonds: 100 };
}

/**
 * Pure function to calculate contribution order priority
 * Returns ordered list of account types to contribute to
 */
export function getContributionOrder(
  hasEmployerPlan: boolean,
  hasRothIRA: boolean,
  hasTraditionalIRA: boolean,
  hasTaxable: boolean
): string[] {
  const order: string[] = [];

  if (hasEmployerPlan) {
    order.push('employer-match');
  }

  if (hasRothIRA) {
    order.push('roth-ira');
  } else if (hasTraditionalIRA) {
    order.push('traditional-ira');
  }

  if (hasEmployerPlan) {
    order.push('employer-full');
  }

  if (hasTaxable) {
    order.push('taxable');
  }

  return order;
}

/**
 * Pure function to calculate target savings rate based on age
 * Returns percentage of gross income to save for retirement
 */
export function getTargetSavingsRate(age: number): number {
  if (age < 25) {
    return 15; // Starting early: 15%
  } else if (age < 30) {
    return 15; // Still early: 15%
  } else if (age < 35) {
    return 18; // Catching up: 18%
  } else if (age < 40) {
    return 20; // More urgent: 20%
  } else {
    return 25; // Late start: 25%+
  }
}


