import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type StepKey = "info" | "showing" | "setting" | "payment";

const stepKeyToIndex: Record<StepKey, number> = {
  info: 1,
  showing: 2,
  setting: 3,
  payment: 4,
};

const indexToStepKey: Record<number, StepKey> = {
  1: "info",
  2: "showing",
  3: "setting",
  4: "payment",
};

export const useStepUrlSync = (eventId: string) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy step từ URL hoặc default là "showing" (step 2)
  const initialStepParam = (searchParams.get("step") as StepKey) || "showing";
  const [currentStep, setCurrentStep] = useState<number>(stepKeyToIndex[initialStepParam] || 2);
  const [maxNavigableStep, setMaxNavigableStep] = useState<number>(Math.max(1, currentStep));

  // Enforce locking even if URL param tries to jump ahead
  useEffect(() => {
    if (currentStep > maxNavigableStep) {
      const adjusted = maxNavigableStep;
      setCurrentStep(adjusted);
      const qs = new URLSearchParams(Array.from(searchParams.entries()));
      const stepKey = indexToStepKey[adjusted];
      qs.set("step", stepKey);
      router.replace(`/organizer/create-event/${eventId}?${qs.toString()}`);
    }
  }, [currentStep, maxNavigableStep, router, eventId, searchParams]);

  // Keep URL step param in sync and support reload persistence
  useEffect(() => {
    const stepKey = indexToStepKey[currentStep];
    if (stepKey) { // Thêm check để tránh undefined
      const qs = new URLSearchParams(Array.from(searchParams.entries()));
      if (qs.get("step") !== stepKey) {
        qs.set("step", stepKey);
        router.replace(`/organizer/create-event/${eventId}?${qs.toString()}`);
      }
    }
  }, [currentStep, router, searchParams, eventId]);

  return { 
    currentStep, 
    setCurrentStep, 
    maxNavigableStep, 
    setMaxNavigableStep,
    stepKeyToIndex, 
    indexToStepKey 
  };
};