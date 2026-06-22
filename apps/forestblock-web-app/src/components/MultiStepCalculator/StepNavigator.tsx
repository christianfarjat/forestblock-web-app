import { steps } from "./stepsConfig";

const StepNavigator: React.FC<{
  steps: typeof steps;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ steps, currentStep, setCurrentStep }) => (
  <div className="flex flex-wrap justify-center gap-4 mb-4 text-center">
    {steps.map((step, index) => (
      <div key={step.id} className="flex flex-col items-center">
        <button
          onClick={() => setCurrentStep(index)}
          className={`flex items-center justify-center p-3 rounded-full w-16 h-16 text-xl ${
            index === currentStep ? "bg-green-800 text-white" : "bg-gray-200"
          }`}
        >
          {step.icon}
        </button>
        <span className="text-xs mt-2 font-bold">{step.label}</span>
      </div>
    ))}
  </div>
);

export default StepNavigator;
