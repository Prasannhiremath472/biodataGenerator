import { WIZARD_STEPS } from './wizardSteps';

export function StepIndicator({ currentIndex, onStepClick }: { currentIndex: number; onStepClick: (index: number) => void }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex min-w-max items-center gap-2">
        {WIZARD_STEPS.map((step, idx) => (
          <div key={step.key} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStepClick(idx)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                idx === currentIndex
                  ? 'bg-gray-900 text-white'
                  : idx < currentIndex
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-500'
              }`}
            >
              Step {idx + 1}: {step.label}
            </button>
            {idx < WIZARD_STEPS.length - 1 && <div className="h-px w-6 bg-gray-300" />}
          </div>
        ))}
      </div>
    </div>
  );
}
