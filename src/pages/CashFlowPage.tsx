import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { saveProgress, loadProgress } from '../utils/storage';
import { UserInputs, Debt, EmployerPlan } from '../types';

export default function CashFlowPage() {
  const navigate = useNavigate();
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [emergencyFundMonths, setEmergencyFundMonths] = useState<number>(0);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [employerPlan, setEmployerPlan] = useState<EmployerPlan>({
    hasPlan: false,
  });

  useEffect(() => {
    const saved = loadProgress();
    if (saved.monthlyExpenses) setMonthlyExpenses(saved.monthlyExpenses);
    if (saved.emergencyFundMonths !== undefined) setEmergencyFundMonths(saved.emergencyFundMonths);
    if (saved.debts) setDebts(saved.debts);
    if (saved.employerPlan) setEmployerPlan(saved.employerPlan);
  }, []);

  const addDebt = () => {
    setDebts([
      ...debts,
      {
        type: 'credit card',
        balance: 0,
        apr: 0,
        minPayment: 0,
      },
    ]);
  };

  const updateDebt = (index: number, field: keyof Debt, value: string | number) => {
    const updated = [...debts];
    updated[index] = { ...updated[index], [field]: value };
    setDebts(updated);
  };

  const removeDebt = (index: number) => {
    setDebts(debts.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (monthlyExpenses <= 0) {
      alert('Please estimate your monthly expenses');
      return;
    }

    const inputs: Partial<UserInputs> = {
      monthlyExpenses,
      emergencyFundMonths,
      debts: debts.filter(d => d.balance > 0),
      employerPlan,
    };
    saveProgress(inputs);
    navigate('/goals');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <ProgressBar current={2} total={6} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cash Flow & Debts</h1>
        <p className="text-gray-600 mb-8">
          Understanding your expenses and debts helps prioritize your financial plan
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Expenses (Estimate) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyExpenses || ''}
                onChange={(e) => setMonthlyExpenses(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include rent/mortgage, utilities, food, transportation, etc.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Fund (Months of Expenses)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={emergencyFundMonths || ''}
              onChange={(e) => setEmergencyFundMonths(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              How many months of expenses do you currently have saved?
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Debts
              </label>
              <button
                onClick={addDebt}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Debt
              </button>
            </div>

            {debts.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No debts added</p>
            ) : (
              <div className="space-y-4">
                {debts.map((debt, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">Debt #{index + 1}</h4>
                      <button
                        onClick={() => removeDebt(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Type
                      </label>
                      <select
                        value={debt.type}
                        onChange={(e) => updateDebt(index, 'type', e.target.value as Debt['type'])}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="credit card">Credit Card</option>
                        <option value="student">Student Loan</option>
                        <option value="auto">Auto Loan</option>
                        <option value="personal">Personal Loan</option>
                        <option value="mortgage">Mortgage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Balance
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={debt.balance || ''}
                          onChange={(e) => updateDebt(index, 'balance', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          APR (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="0.1"
                          value={debt.apr || ''}
                          onChange={(e) => updateDebt(index, 'apr', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="0%"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Min Payment
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={debt.minPayment || ''}
                          onChange={(e) => updateDebt(index, 'minPayment', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$0"
                        />
                      </div>
                    </div>

                    {debt.apr >= 8 && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-2">
                        <p className="text-xs text-yellow-800">
                          ⚠️ High interest rate. Paying this off should be a priority.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employer Retirement Plan
            </h3>

            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={employerPlan.hasPlan}
                  onChange={(e) =>
                    setEmployerPlan({ ...employerPlan, hasPlan: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I have access to an employer retirement plan (401k, 403b, TSP, etc.)
                </span>
              </label>
            </div>

            {employerPlan.hasPlan && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer Match Percentage
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={employerPlan.matchPercent || ''}
                      onChange={(e) =>
                        setEmployerPlan({
                          ...employerPlan,
                          matchPercent: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    e.g., if they match 50% of your contributions up to 6% of salary, enter 50
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Match Up To (% of Salary)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={employerPlan.matchOfSalary || ''}
                      onChange={(e) =>
                        setEmployerPlan({
                          ...employerPlan,
                          matchOfSalary: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    e.g., if they match up to 6% of your salary, enter 6
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

