interface StepperProps {
  currentStep: number;
}

const steps = ["Thông tin", "Vé & Suất", "Cài đặt", "Thanh toán"];

export default function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="flex justify-between items-center">
      {steps.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <div key={step} className="flex-1 flex items-center">
            <div
              className={`rounded-full w-10 h-10 flex items-center justify-center ${
                isActive
                  ? "bg-blue-500 text-white"
                  : isDone
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {step}
            </div>
            <span className="ml-2">{label}</span>
            {step < steps.length && (
              <div className="flex-1 h-1 bg-gray-300 mx-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
