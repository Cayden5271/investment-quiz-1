import { Link } from 'react-router-dom';

export default function LearnMorePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Learn More</h1>
          <p className="text-gray-600 mb-8">
            Key concepts to help you understand your investment plan
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Rebalancing</h2>
              <p className="text-gray-700 mb-3">
                Over time, your portfolio's asset allocation will drift as different investments perform differently.
                Rebalancing means adjusting your holdings back to your target allocation.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>When to rebalance:</strong> Annually, or when any asset class drifts more than 5-10% from its target.
              </p>
              <p className="text-gray-700">
                <strong>How:</strong> Sell assets that have grown beyond their target and buy more of those that have underperformed.
                This enforces the discipline of "buying low and selling high."
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dollar-Cost Averaging (DCA)</h2>
              <p className="text-gray-700 mb-3">
                Dollar-cost averaging means investing a fixed amount regularly (e.g., monthly) regardless of market conditions.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Benefits:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                <li>Reduces the impact of market volatility</li>
                <li>Eliminates the need to time the market</li>
                <li>Builds discipline and consistency</li>
                <li>Often results in buying more shares when prices are low</li>
              </ul>
              <p className="text-gray-700">
                Most employer retirement plans and many brokerages allow you to set up automatic monthly contributions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Fees (Expense Ratios)</h2>
              <p className="text-gray-700 mb-3">
                Every fund charges fees, expressed as an "expense ratio" (annual percentage of assets).
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why it matters:</strong> Fees directly reduce your returns. A 1% fee on a $100,000 portfolio costs $1,000 per year.
                Over 30 years, that adds up significantly.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>What to look for:</strong> Index funds typically have expense ratios under 0.15% (often 0.03-0.10%).
                Actively managed funds often charge 0.5-1.5% or more.
              </p>
              <p className="text-gray-700">
                <strong>Rule of thumb:</strong> Lower fees generally lead to better long-term returns, all else equal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Diversification</h2>
              <p className="text-gray-700 mb-3">
                Diversification means spreading your investments across different asset classes, sectors, and geographic regions.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>Why it works:</strong> Different investments perform differently at different times.
                When one asset class is down, another may be up, reducing overall portfolio volatility.
              </p>
              <p className="text-gray-700 mb-3">
                <strong>How to diversify:</strong>
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 mb-3">
                <li>Hold both stocks and bonds</li>
                <li>Include both US and international stocks</li>
                <li>Use broad market index funds (they're already diversified)</li>
                <li>Avoid putting too much in any single stock or sector</li>
              </ul>
              <p className="text-gray-700">
                A total stock market index fund like VTI holds thousands of companies, providing instant diversification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Behavioral Tips</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Stay the Course</h3>
                  <p className="text-gray-700">
                    Market downturns are normal and temporary. Resist the urge to sell during volatility.
                    Historically, markets have recovered and continued growing over long periods.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Automate Everything</h3>
                  <p className="text-gray-700">
                    Set up automatic contributions so you invest consistently without having to make decisions each month.
                    This removes emotion from the equation.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Don't Check Too Often</h3>
                  <p className="text-gray-700">
                    Checking your portfolio daily can lead to emotional decisions. For long-term investors,
                    quarterly or annual reviews are sufficient.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Focus on What You Can Control</h3>
                  <p className="text-gray-700">
                    You can't control market returns, but you can control: how much you save, fees you pay,
                    asset allocation, and staying invested for the long term.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Remember</h2>
              <p className="text-gray-700">
                This tool is for <strong>educational purposes only</strong> and is not financial advice.
                Investing involves risk, including loss of principal. Past performance does not guarantee future results.
                Consider consulting a <strong>fiduciary financial professional</strong> for personalized advice.
              </p>
            </section>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              to="/results"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back to Results
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Over
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

