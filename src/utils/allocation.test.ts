import { describe, it, expect } from 'vitest';
import {
  calculateEquitySplit,
  calculateBondSplit,
  calculateMonthlyAllocations,
  calculateShortTermAllocation,
  getContributionOrder,
  getTargetSavingsRate,
} from './allocation';

describe('calculateEquitySplit', () => {
  it('should default to 70/30 split', () => {
    const result = calculateEquitySplit(100);
    expect(result.us).toBe(70);
    expect(result.international).toBe(30);
    expect(result.us + result.international).toBe(100);
  });

  it('should use provided ratio', () => {
    const result = calculateEquitySplit(100, 0.75);
    expect(result.us).toBe(75);
    expect(result.international).toBe(25);
  });

  it('should clamp ratio to 0.6-0.8 range', () => {
    const lowResult = calculateEquitySplit(100, 0.5);
    expect(lowResult.us).toBe(60); // Clamped to minimum
    expect(lowResult.international).toBe(40);

    const highResult = calculateEquitySplit(100, 0.9);
    expect(highResult.us).toBe(80); // Clamped to maximum
    expect(highResult.international).toBe(20);
  });

  it('should always sum to total equity', () => {
    const testCases = [50, 100, 200, 1000];
    testCases.forEach(total => {
      const result = calculateEquitySplit(total);
      expect(result.us + result.international).toBe(total);
    });
  });
});

describe('calculateBondSplit', () => {
  it('should default to 80/20 split', () => {
    const result = calculateBondSplit(100);
    expect(result.totalBond).toBe(80);
    expect(result.shortTerm).toBe(20);
    expect(result.totalBond + result.shortTerm).toBe(100);
  });

  it('should use provided ratio', () => {
    const result = calculateBondSplit(100, 0.3);
    expect(result.totalBond).toBe(70);
    expect(result.shortTerm).toBe(30);
  });

  it('should clamp ratio to 0-0.5 range', () => {
    const negativeResult = calculateBondSplit(100, -0.1);
    expect(negativeResult.shortTerm).toBe(0);

    const highResult = calculateBondSplit(100, 0.7);
    expect(highResult.shortTerm).toBeLessThanOrEqual(50);
  });

  it('should always sum to total bonds', () => {
    const testCases = [50, 100, 200];
    testCases.forEach(total => {
      const result = calculateBondSplit(total);
      expect(result.totalBond + result.shortTerm).toBe(total);
    });
  });
});

describe('calculateMonthlyAllocations', () => {
  it('should distribute monthly amount by percentages', () => {
    const percentages = [
      { label: 'Stocks', percentage: 70 },
      { label: 'Bonds', percentage: 30 },
    ];
    const result = calculateMonthlyAllocations(1000, percentages);

    expect(result).toHaveLength(2);
    expect(result[0].monthlyDollars).toBe(700);
    expect(result[1].monthlyDollars).toBe(300);
  });

  it('should normalize percentages that do not sum to 100', () => {
    const percentages = [
      { label: 'A', percentage: 50 },
      { label: 'B', percentage: 50 },
      { label: 'C', percentage: 50 }, // Sums to 150%
    ];
    const result = calculateMonthlyAllocations(1000, percentages);

    const total = result.reduce((sum, r) => sum + r.monthlyDollars, 0);
    expect(total).toBeCloseTo(1000, 2);
  });

  it('should handle zero total percentage', () => {
    const percentages = [
      { label: 'A', percentage: 0 },
      { label: 'B', percentage: 0 },
    ];
    const result = calculateMonthlyAllocations(1000, percentages);

    expect(result).toHaveLength(2);
    expect(result[0].monthlyDollars).toBe(0);
    expect(result[1].monthlyDollars).toBe(0);
  });

  it('should preserve labels', () => {
    const percentages = [
      { label: 'US Stocks', percentage: 100 },
    ];
    const result = calculateMonthlyAllocations(1000, percentages);

    expect(result[0].label).toBe('US Stocks');
  });
});

describe('calculateShortTermAllocation', () => {
  it('should return 100% cash for must-have goals within 24 months', () => {
    const result = calculateShortTermAllocation(12, true);
    expect(result.cash).toBe(100);
    expect(result.bonds).toBe(0);
  });

  it('should return 90/10 for goals within 18 months', () => {
    const result = calculateShortTermAllocation(12, false);
    expect(result.cash).toBe(90);
    expect(result.bonds).toBe(10);
  });

  it('should return 60/40 for goals 18-36 months', () => {
    const result = calculateShortTermAllocation(24, false);
    expect(result.cash).toBe(60);
    expect(result.bonds).toBe(40);
  });

  it('should return 0/100 for goals beyond 36 months', () => {
    const result = calculateShortTermAllocation(48, false);
    expect(result.cash).toBe(0);
    expect(result.bonds).toBe(100);
  });

  it('should always sum to 100%', () => {
    const testCases = [
      { months: 6, mustHave: true },
      { months: 12, mustHave: false },
      { months: 24, mustHave: false },
      { months: 30, mustHave: false },
      { months: 48, mustHave: false },
    ];

    testCases.forEach(({ months, mustHave }) => {
      const result = calculateShortTermAllocation(months, mustHave);
      expect(result.cash + result.bonds).toBe(100);
    });
  });
});

describe('getContributionOrder', () => {
  it('should prioritize employer match first', () => {
    const order = getContributionOrder(true, true, false, true);
    expect(order[0]).toBe('employer-match');
  });

  it('should include Roth IRA if available', () => {
    const order = getContributionOrder(false, true, false, false);
    expect(order).toContain('roth-ira');
  });

  it('should include Traditional IRA if Roth not available', () => {
    const order = getContributionOrder(false, false, true, false);
    expect(order).toContain('traditional-ira');
  });

  it('should prefer Roth over Traditional', () => {
    const order = getContributionOrder(false, true, true, false);
    expect(order).toContain('roth-ira');
    expect(order).not.toContain('traditional-ira');
  });

  it('should include taxable as last option', () => {
    const order = getContributionOrder(false, false, false, true);
    expect(order[order.length - 1]).toBe('taxable');
  });

  it('should return empty array if no accounts available', () => {
    const order = getContributionOrder(false, false, false, false);
    expect(order).toEqual([]);
  });

  it('should follow correct order: match -> IRA -> employer full -> taxable', () => {
    const order = getContributionOrder(true, true, false, true);
    expect(order[0]).toBe('employer-match');
    expect(order[1]).toBe('roth-ira');
    expect(order[2]).toBe('employer-full');
    expect(order[3]).toBe('taxable');
  });
});

describe('getTargetSavingsRate', () => {
  it('should return 15% for ages under 25', () => {
    expect(getTargetSavingsRate(20)).toBe(15);
    expect(getTargetSavingsRate(24)).toBe(15);
  });

  it('should return 15% for ages 25-29', () => {
    expect(getTargetSavingsRate(25)).toBe(15);
    expect(getTargetSavingsRate(29)).toBe(15);
  });

  it('should return 18% for ages 30-34', () => {
    expect(getTargetSavingsRate(30)).toBe(18);
    expect(getTargetSavingsRate(34)).toBe(18);
  });

  it('should return 20% for ages 35-39', () => {
    expect(getTargetSavingsRate(35)).toBe(20);
    expect(getTargetSavingsRate(39)).toBe(20);
  });

  it('should return 25% for ages 40+', () => {
    expect(getTargetSavingsRate(40)).toBe(25);
    expect(getTargetSavingsRate(50)).toBe(25);
    expect(getTargetSavingsRate(60)).toBe(25);
  });

  it('should increase with age', () => {
    const rate20 = getTargetSavingsRate(20);
    const rate30 = getTargetSavingsRate(30);
    const rate40 = getTargetSavingsRate(40);

    expect(rate20).toBeLessThanOrEqual(rate30);
    expect(rate30).toBeLessThanOrEqual(rate40);
  });
});

