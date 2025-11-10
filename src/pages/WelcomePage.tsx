import { Link } from 'react-router-dom';
import { clearProgress } from '../utils/storage';

export default function WelcomePage() {
  const handleStart = () => {
    clearProgress(); // Start fresh
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Investment Planning Quiz
        </h1>
        <p className="text-xl text-gray-600 mb-8 text-center">
          Get a personalized, educational investment plan tailored to your goals
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
          <p className="text-sm text-red-700 font-semibold mb-2">
            ⚠️ Educational Tool Only
          </p>
          <p className="text-sm text-gray-700">
            This tool is for <strong>educational purposes only</strong> and{' '}
            <strong>is not financial advice</strong>. Investing involves risk, including loss of principal.
            Consider consulting a <strong>fiduciary financial professional</strong> for personalized advice.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📊</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Personalized Portfolio
              </h3>
              <p className="text-gray-600 text-sm">
                Get a mock portfolio allocation based on your risk tolerance and goals
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Step-by-Step Action Plan
              </h3>
              <p className="text-gray-600 text-sm">
                Clear priorities: emergency fund, debt payoff, employer match, and investments
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">📚</div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Educational Explanations
              </h3>
              <p className="text-gray-600 text-sm">
                Learn the <em>why</em> behind each recommendation in plain language
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <p className="text-sm text-gray-700">
            <strong>Time to complete:</strong> ~10-15 minutes
          </p>
          <p className="text-sm text-gray-700 mt-2">
            <strong>Privacy:</strong> Your data is stored locally in your browser. We don't collect or sell any information.
          </p>
        </div>

        <Link
          to="/profile"
          onClick={handleStart}
          className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          Get Started →
        </Link>
      </div>
    </div>
  );
}

