import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { saveProgress, loadProgress } from '../utils/storage';
import { UserInputs, ShortTermGoal, LongTermGoal } from '../types';

export default function GoalsPage() {
  const navigate = useNavigate();
  const [goalsShort, setGoalsShort] = useState<ShortTermGoal[]>([]);
  const [goalsLong, setGoalsLong] = useState<LongTermGoal[]>([]);
  const [maxMonthlyInvest, setMaxMonthlyInvest] = useState<number>(0);
  const [oneTimeStart, setOneTimeStart] = useState<number>(0);

  useEffect(() => {
    const saved = loadProgress();
    if (saved.goalsShort) setGoalsShort(saved.goalsShort);
    if (saved.goalsLong) setGoalsLong(saved.goalsLong);
    if (saved.maxMonthlyInvest) setMaxMonthlyInvest(saved.maxMonthlyInvest);
    if (saved.oneTimeStart) setOneTimeStart(saved.oneTimeStart);
  }, []);

  const addShortTermGoal = () => {
    setGoalsShort([
      ...goalsShort,
      {
        name: '',
        targetAmount: 0,
        targetDateISO: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mustHave: true,
      },
    ]);
  };

  const updateShortTermGoal = (index: number, field: keyof ShortTermGoal, value: string | number | boolean) => {
    const updated = [...goalsShort];
    updated[index] = { ...updated[index], [field]: value };
    setGoalsShort(updated);
  };

  const removeShortTermGoal = (index: number) => {
    setGoalsShort(goalsShort.filter((_, i) => i !== index));
  };

  const addLongTermGoal = () => {
    setGoalsLong([
      ...goalsLong,
      {
        name: 'retirement',
      },
    ]);
  };

  const updateLongTermGoal = (index: number, field: keyof LongTermGoal, value: string | number) => {
    const updated = [...goalsLong];
    updated[index] = { ...updated[index], [field]: value };
    setGoalsLong(updated);
  };

  const removeLongTermGoal = (index: number) => {
    setGoalsLong(goalsLong.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (maxMonthlyInvest <= 0) {
      alert('Please enter how much you can invest monthly');
      return;
    }

    const inputs: Partial<UserInputs> = {
      goalsShort: goalsShort.filter(g => g.name && g.targetAmount > 0),
      goalsLong: goalsLong.filter(g => g.name),
      maxMonthlyInvest,
      oneTimeStart,
    };
    saveProgress(inputs);
    navigate('/risk');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <ProgressBar current={3} total={6} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Goals</h1>
        <p className="text-gray-600 mb-8">
          What are you saving and investing for? Short-term (≤3 years) and long-term goals
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Short-Term Goals (≤3 years)</h2>
              <button
                onClick={addShortTermGoal}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Goal
              </button>
            </div>

            {goalsShort.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No short-term goals added</p>
            ) : (
              <div className="space-y-4">
                {goalsShort.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">Short-Term Goal #{index + 1}</h4>
                      <button
                        onClick={() => removeShortTermGoal(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Goal Name
                      </label>
                      <input
                        type="text"
                        value={goal.name}
                        onChange={(e) => updateShortTermGoal(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Vacation, Emergency Fund, Down Payment"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Amount
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={goal.targetAmount || ''}
                          onChange={(e) => updateShortTermGoal(index, 'targetAmount', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Date
                        </label>
                        <input
                          type="date"
                          value={goal.targetDateISO}
                          onChange={(e) => updateShortTermGoal(index, 'targetDateISO', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={goal.mustHave}
                          onChange={(e) => updateShortTermGoal(index, 'mustHave', e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-700">
                          Must-have (prioritize safety over returns)
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Long-Term Goals (&gt;3 years)</h2>
              <button
                onClick={addLongTermGoal}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Goal
              </button>
            </div>

            {goalsLong.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No long-term goals added</p>
            ) : (
              <div className="space-y-4">
                {goalsLong.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">Long-Term Goal #{index + 1}</h4>
                      <button
                        onClick={() => removeLongTermGoal(index)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Goal Type
                      </label>
                      <select
                        value={goal.name}
                        onChange={(e) => updateLongTermGoal(index, 'name', e.target.value as LongTermGoal['name'])}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="retirement">Retirement</option>
                        <option value="home">Home Purchase</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {goal.name === 'other' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Target Amount (Optional)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={goal.targetAmount || ''}
                          onChange={(e) => updateLongTermGoal(index, 'targetAmount', parseFloat(e.target.value) || undefined)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="$0"
                        />
                      </div>
                    )}

                    {goal.name === 'retirement' && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-700">
                          💡 For retirement, we'll use age-appropriate allocation and target savings rates.
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
              Investment Capacity
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Monthly Investment <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={maxMonthlyInvest || ''}
                    onChange={(e) => setMaxMonthlyInvest(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  How much can you comfortably invest each month after expenses?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  One-Time Starting Amount (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={oneTimeStart || ''}
                    onChange={(e) => setOneTimeStart(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Any lump sum you want to invest now (optional)
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/cashflow')}
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

