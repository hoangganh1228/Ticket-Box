'use client';

import React from 'react';

interface Step {
  id: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface EventStepperProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  maxNavigableStep?: number;
  onSave: () => void;
  onContinue: () => void;
}

const EventStepper: React.FC<EventStepperProps> = ({
  currentStep,
  onStepChange,
  maxNavigableStep = 1,
  onSave,
  onContinue
}) => {
  const steps: Step[] = [
    {
      id: 1,
      label: 'Thông tin sự kiện',
      isActive: currentStep === 1,
      isCompleted: currentStep > 1
    },
    {
      id: 2,
      label: 'Thời gian & Loại vé',
      isActive: currentStep === 2,
      isCompleted: currentStep > 2
    },
    {
      id: 3,
      label: 'Cài đặt',
      isActive: currentStep === 3,
      isCompleted: currentStep > 3
    },
    {
      id: 4,
      label: 'Thông tin thanh toán',
      isActive: currentStep === 4,
      isCompleted: currentStep > 4
    }
  ];

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.isActive
                    ? 'bg-green-500 text-white'
                    : step.isCompleted
                    ? 'bg-green-500 text-white'
                    : step.id <= maxNavigableStep
                    ? 'bg-white text-gray-700 cursor-pointer'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (step.id <= maxNavigableStep) {
                    onStepChange(step.id);
                  }
                }}
              >
                {step.id}
              </div>
              
              {/* Step Label */}
              <div className="mt-2 text-center">
                <span
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                    step.isActive
                      ? 'text-white'
                      : step.isCompleted
                      ? 'text-white'
                      : step.id <= maxNavigableStep
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-700 -z-10">
          <div
            className="h-full bg-green-500 transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onSave}
          className="px-6 py-2 bg-white text-gray-900 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200"
        >
          Lưu
        </button>
        <button
          onClick={onContinue}
          className="px-6 py-2 bg-green-500 text-white rounded-md font-medium hover:bg-green-600 transition-colors duration-200"
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default EventStepper;
