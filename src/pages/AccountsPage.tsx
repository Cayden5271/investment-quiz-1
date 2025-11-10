import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { saveProgress, loadProgress } from '../utils/storage';
import { UserInputs, AccountsAvailable } from '../types';

export default function AccountsPage() {
  const navigate = useNavigate();
  const [accountsAvailable, setAccountsAvailable] = useState<AccountsAvailable>({
    rothIRA: false,
    traditionalIRA: false,
    taxable: true,
  });

  useEffect(() => {
    const saved = loadProgress();
    if (saved.accountsAvailable) {
      setAccountsAvailable(saved.accountsAvailable);
    }
  }, []);

  const handleNext = () => {
    const inputs: Partial<UserInputs> = {
      accountsAvailable,
    };
    saveProgress(inputs);
    navigate('/results');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <ProgressBar current={5} total={6} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Accounts</h1>
        <p className="text-gray-600 mb-8">
          Which investment accounts do you have access to? (Educational guidance only)
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Note:</strong> This information helps us recommend contribution order. This is educational guidance, not tax advice.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accountsAvailable.rothIRA}
                onChange={(e) =>
                  setAccountsAvailable({ ...accountsAvailable, rothIRA: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Roth IRA</span>
                <p className="text-sm text-gray-600 mt-1">
                  Tax-free growth and withdrawals in retirement. Contributions are after-tax.
                </p>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accountsAvailable.traditionalIRA}
                onChange={(e) =>
                  setAccountsAvailable({ ...accountsAvailable, traditionalIRA: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Traditional IRA</span>
                <p className="text-sm text-gray-600 mt-1">
                  Tax-deferred growth. Contributions may be tax-deductible depending on income.
                </p>
              </div>
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accountsAvailable.taxable}
                onChange={(e) =>
                  setAccountsAvailable({ ...accountsAvailable, taxable: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Taxable Brokerage Account</span>
                <p className="text-sm text-gray-600 mt-1">
                  Regular investment account. No tax advantages, but fully flexible.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Recommended Contribution Order (US):</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Employer plan up to full match (free money!)</li>
            <li>Roth IRA (if eligible) or Traditional IRA up to limit</li>
            <li>Back to employer plan up to target savings rate</li>
            <li>Taxable brokerage for overflow and flexible goals</li>
          </ol>
          <p className="text-xs text-gray-600 mt-2 italic">
            This is general guidance. Consult a tax professional for your specific situation.
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/risk')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Results →
          </button>
        </div>
      </div>
    </div>
  );
}

