import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { saveProgress, loadProgress } from '../utils/storage';
import { UserInputs } from '../types';

const RISK_QUESTIONS = [
  {
    id: 'experience',
    question: 'How would you describe your investment experience?',
    options: [
      { label: 'No experience', value: 0 },
      { label: 'Limited (read about it, never invested)', value: 3 },
      { label: 'Some (invested in 401k or similar)', value: 5 },
      { label: 'Moderate (actively manage some investments)', value: 7 },
      { label: 'Experienced (comfortable with various asset classes)', value: 10 },
    ],
  },
  {
    id: 'timeHorizon',
    question: 'What is your primary investment time horizon?',
    options: [
      { label: 'Less than 3 years', value: 0 },
      { label: '3-5 years', value: 2 },
      { label: '5-10 years', value: 5 },
      { label: '10-20 years', value: 8 },
      { label: 'More than 20 years', value: 10 },
    ],
  },
  {
    id: 'lossReaction',
    question: 'If your portfolio dropped 30% in one year, what would you do?',
    options: [
      { label: 'Sell everything immediately', value: 0 },
      { label: 'Sell some to reduce risk', value: 2 },
      { label: 'Hold and wait', value: 5 },
      { label: 'Buy more (it\'s on sale!)', value: 8 },
      { label: 'Aggressively buy more', value: 10 },
    ],
  },
  {
    id: 'lossAversion',
    question: 'How do you feel about potential losses?',
    options: [
      { label: 'I cannot tolerate any losses', value: 0 },
      { label: 'I prefer minimal risk', value: 3 },
      { label: 'I can accept moderate losses for higher returns', value: 6 },
      { label: 'I\'m comfortable with significant volatility', value: 9 },
      { label: 'I embrace high risk for high reward', value: 10 },
    ],
  },
  {
    id: 'incomeStability',
    question: 'How stable is your income?',
    options: [
      { label: 'Very unstable (irregular, commission-based)', value: 2 },
      { label: 'Somewhat unstable', value: 4 },
      { label: 'Moderately stable', value: 6 },
      { label: 'Very stable (government, tenured)', value: 8 },
      { label: 'Extremely stable (pension, guaranteed)', value: 10 },
    ],
  },
  {
    id: 'goalFlexibility',
    question: 'How flexible are your financial goals?',
    options: [
      { label: 'Not flexible at all (must meet deadlines)', value: 2 },
      { label: 'Somewhat flexible', value: 5 },
      { label: 'Moderately flexible', value: 7 },
      { label: 'Very flexible', value: 9 },
      { label: 'Completely flexible', value: 10 },
    ],
  },
];

export default function RiskQuizPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    const saved = loadProgress();
    if (saved.riskQuizAnswers) {
      setAnswers(saved.riskQuizAnswers);
    }
  }, []);

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < RISK_QUESTIONS.length) {
      alert(`Please answer all ${RISK_QUESTIONS.length} questions`);
      return;
    }

    const inputs: Partial<UserInputs> = {
      riskQuizAnswers: answers,
    };
    saveProgress(inputs);
    navigate('/accounts');
  };

  const progress = (Object.keys(answers).length / RISK_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <ProgressBar current={4} total={6} />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk & Time Horizon</h1>
        <p className="text-gray-600 mb-8">
          Help us understand your risk tolerance and investment preferences
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="text-gray-600">{Object.keys(answers).length} / {RISK_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-8">
          {RISK_QUESTIONS.map((question) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {question.question}
              </h3>
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[question.id] === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={answers[question.id] === option.value}
                      onChange={() => handleAnswer(question.id, option.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => navigate('/goals')}
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

