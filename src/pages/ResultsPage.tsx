import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { loadProgress } from '../utils/storage';
import { generatePortfolioPlan } from '../utils/logic';
import { exportToPDF, exportToCSV, exportToJSON } from '../utils/export';
import { UserInputs, PortfolioPlan } from '../types';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

export default function ResultsPage() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PortfolioPlan | null>(null);
  const [inputs, setInputs] = useState<UserInputs | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'goals'>('overview');

  useEffect(() => {
    const saved = loadProgress();
    if (!saved.age || !saved.netMonthlyIncome || !saved.maxMonthlyInvest) {
      alert('Missing required information. Please start over.');
      navigate('/');
      return;
    }

    // Fill in defaults for missing fields
    const completeInputs: UserInputs = {
      age: saved.age || 25,
      country: saved.country || 'US',
      netMonthlyIncome: saved.netMonthlyIncome || 0,
      variableIncome: saved.variableIncome || false,
      monthlyExpenses: saved.monthlyExpenses || 0,
      emergencyFundMonths: saved.emergencyFundMonths || 0,
      debts: saved.debts || [],
      employerPlan: saved.employerPlan || { hasPlan: false },
      accountsAvailable: saved.accountsAvailable || { rothIRA: false, traditionalIRA: false, taxable: true },
      goalsShort: saved.goalsShort || [],
      goalsLong: saved.goalsLong || [],
      maxMonthlyInvest: saved.maxMonthlyInvest || 0,
      oneTimeStart: saved.oneTimeStart || 0,
      riskQuizAnswers: saved.riskQuizAnswers || {},
    };

    setInputs(completeInputs);
    const generatedPlan = generatePortfolioPlan(completeInputs);
    setPlan(generatedPlan);
  }, [navigate]);

  if (!plan || !inputs) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your plan...</p>
        </div>
      </div>
    );
  }

  const pieData = plan.allocations.map(a => ({
    name: a.label,
    value: a.percentage,
  }));

  const barData = plan.allocations.map(a => ({
    name: a.label.length > 15 ? a.label.substring(0, 15) + '...' : a.label,
    amount: a.monthlyDollars,
  }));

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Investment Plan</h1>
          <p className="text-gray-600 mb-6">
            Personalized recommendations based on your goals and risk tolerance
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-800 font-semibold mb-1">
              ⚠️ Educational Tool Only
            </p>
            <p className="text-sm text-red-700">
              This tool is for <strong>educational purposes only</strong> and{' '}
              <strong>is not financial advice</strong>. Investing involves risk, including loss of principal.
              Consider consulting a <strong>fiduciary financial professional</strong> for personalized advice.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'portfolio'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Goal Buckets
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* At-a-glance tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Emergency Fund</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {plan.emergencyFundStatus.currentMonths.toFixed(1)} / {plan.emergencyFundStatus.targetMonths} months
                  </div>
                  {plan.emergencyFundStatus.monthlyTopUp > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      ${plan.emergencyFundStatus.monthlyTopUp.toFixed(0)}/mo to build
                    </div>
                  )}
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Risk Profile</div>
                  <div className="text-2xl font-bold text-gray-900">{plan.riskProfile}</div>
                  <div className="text-xs text-gray-600 mt-1">Score: {plan.riskScore}/100</div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Monthly Investment</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.actionPlan.reduce((sum, item) => sum + item.monthlyAmount, 0).toFixed(0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Total allocated</div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Asset Allocation</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {plan.equityPercentage}% / {plan.bondPercentage}%
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Stocks / Bonds</div>
                </div>
              </div>

              {/* Debt Priority */}
              {plan.debtPriority && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🎯 Priority: Pay Off High-Interest Debt
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    Your {plan.debtPriority.debt.type} debt at {plan.debtPriority.debt.apr}% APR should be paid off first.
                    This is likely your best risk-free return.
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Monthly payment:</strong> ${plan.debtPriority.monthlyPayment.toFixed(2)} |{' '}
                    <strong>Payoff timeline:</strong> {plan.debtPriority.payoffMonths} months
                  </p>
                </div>
              )}

              {/* Action Plan */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Action Plan</h2>
                <div className="space-y-3">
                  {plan.actionPlan.map((item) => (
                    <div key={item.priority} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                              {item.priority}
                            </span>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          {item.timeline && (
                            <p className="text-xs text-gray-500">Timeline: {item.timeline}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            ${item.monthlyAmount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">per month</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No allocations to display</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Contributions</h3>
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                        <Bar dataKey="amount" fill="#667eea" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-gray-500">No contributions to display</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Details</h3>
                <div className="space-y-4">
                  {plan.allocations.map((allocation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{allocation.label}</h4>
                          {allocation.ticker && (
                            <p className="text-sm text-gray-500">Ticker: {allocation.ticker}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {allocation.percentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600">
                            ${allocation.monthlyDollars.toFixed(2)}/mo
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{allocation.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Why This Works</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Low fees: Index funds typically have expense ratios under 0.15%</li>
                  <li>Diversification: Broad market exposure reduces individual stock risk</li>
                  <li>Automated: Set up monthly contributions and let time work for you</li>
                  <li>Rebalancing: Review annually or when allocations drift 5-10%</li>
                </ul>
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6">
              {plan.goalBuckets.length === 0 ? (
                <p className="text-gray-500">No specific goal buckets allocated</p>
              ) : (
                plan.goalBuckets.map((bucket, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{bucket.goalName}</h3>
                    <p className="text-sm text-gray-600 mb-4">{bucket.explanation}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Target: ${bucket.targetAmount.toLocaleString()}</span>
                        <span className="text-gray-600">{bucket.fundingProgress.toFixed(0)}% funded</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${bucket.fundingProgress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      {bucket.currentAllocation.map((alloc, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700">{alloc.label}</span>
                          <span className="font-medium text-gray-900">
                            {alloc.percentage.toFixed(0)}% (${alloc.monthlyDollars.toFixed(2)}/mo)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Export buttons */}
          <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
            <button
              onClick={() => exportToPDF(plan, inputs)}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              📄 Export PDF
            </button>
            <button
              onClick={() => exportToCSV(plan)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📊 Export CSV
            </button>
            <button
              onClick={() => exportToJSON(plan, inputs)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              💾 Export JSON
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate('/accounts')}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            onClick={() => navigate('/learn')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}

