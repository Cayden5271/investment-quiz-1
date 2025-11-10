import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { saveProgress, loadProgress } from '../utils/storage';
import { UserInputs } from '../types';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [age, setAge] = useState<number>(0);
  const [country, setCountry] = useState<'US' | 'Other'>('US');
  const [netMonthlyIncome, setNetMonthlyIncome] = useState<number>(0);
  const [variableIncome, setVariableIncome] = useState<boolean>(false);
  const [employmentStatus, setEmploymentStatus] = useState<string>('');
  const [livingSituation, setLivingSituation] = useState<string>('');

  useEffect(() => {
    const saved = loadProgress();
    if (saved.age) setAge(saved.age);
    if (saved.country) setCountry(saved.country);
    if (saved.netMonthlyIncome) setNetMonthlyIncome(saved.netMonthlyIncome);
    if (saved.variableIncome !== undefined) setVariableIncome(saved.variableIncome);
  }, []);

  const handleNext = () => {
    if (age < 16 || age > 100) {
      alert('Please enter a valid age (16-100)');
      return;
    }
    if (netMonthlyIncome <= 0) {
      alert('Please enter your monthly net income');
      return;
    }

    const inputs: Partial<UserInputs> = {
      age,
      country,
      netMonthlyIncome,
      variableIncome,
    };
    saveProgress(inputs);
    navigate('/cashflow');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <ProgressBar current={1} total={6} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">About You</h1>
        <p className="text-gray-600 mb-8">
          Let's start with some basic information about your situation
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="16"
              max="100"
              value={age || ''}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your age"
            />
            <p className="text-xs text-gray-500 mt-1">
              Focus is on ages 16-35, but all adults welcome
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value as 'US' | 'Other')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="US">United States</option>
              <option value="Other">Other</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Used for account type recommendations (US vs international)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Net Income (After Taxes) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">$</span>
              <input
                type="number"
                min="0"
                step="100"
                value={netMonthlyIncome || ''}
                onChange={(e) => setNetMonthlyIncome(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Your take-home pay after taxes and deductions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status
            </label>
            <select
              value={employmentStatus}
              onChange={(e) => setEmploymentStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="full-time">Full-time employed</option>
              <option value="part-time">Part-time employed</option>
              <option value="self-employed">Self-employed</option>
              <option value="student">Student</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={variableIncome}
                onChange={(e) => setVariableIncome(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                I have variable or irregular income
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              If checked, we'll recommend a larger emergency fund (6+ months)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Living Situation
            </label>
            <select
              value={livingSituation}
              onChange={(e) => setLivingSituation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select...</option>
              <option value="renting">Renting</option>
              <option value="owning">Owning (with mortgage)</option>
              <option value="owning-paid">Owning (paid off)</option>
              <option value="living-with-family">Living with family</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/')}
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

