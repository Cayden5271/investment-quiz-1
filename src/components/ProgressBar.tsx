interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {current} of {total}
        </span>
        <span className="text-sm text-gray-500">{Math.round(percentage)}%</span>
      </div>
      <div className="flex gap-2">
        {steps.map((step) => (
          <div
            key={step}
            className={`flex-1 h-2 rounded-full transition-all ${
              step < current
                ? 'bg-green-500'
                : step === current
                ? 'bg-blue-600'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

