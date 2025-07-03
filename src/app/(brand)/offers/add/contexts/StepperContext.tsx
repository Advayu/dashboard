// StepperContext.tsx
import { createContext, useContext, useState } from "react";

interface Step {
  label: string;
  component: () => React.ReactNode;
}

interface StepperContextType {
  steps: Step[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  completedSteps: boolean[];
  handleStepClick: (index: number) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

interface StepperProviderProps {
  children: React.ReactNode;
  steps: Step[];
}

export const StepperProvider = ({ children, steps }: StepperProviderProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(
    Array(steps.length).fill(true)
  );

  console.log("active step", activeStep);

  const handleNext = () => {
    setCompletedSteps((prev) => {
      const updated = [...prev];
      updated[activeStep] = true;
      return updated;
    });
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };
  const handleStepClick = (index: number) => {
    console.log("index", index);
    setActiveStep((currentStep) => {
      const isPreviousOrCurrent = index <= currentStep;
      const isNextAndCompleted =
        index === currentStep + 1 && completedSteps[currentStep];

      if (isPreviousOrCurrent || isNextAndCompleted) {
        return index;
      }

      return currentStep; // don't change if not allowed
    });
  };

  return (
    <StepperContext.Provider
      value={{
        steps,
        activeStep,
        setActiveStep,
        handleNext,
        handleBack,
        completedSteps,
        handleStepClick,
      }}>
      {children}
    </StepperContext.Provider>
  );
};

export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context)
    throw new Error("useStepper must be used within StepperProvider");
  return context;
};
