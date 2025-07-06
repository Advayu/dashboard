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
    Array(steps.length).fill(false)
  );

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
    if (index === activeStep) return;

    const isGoingBack = index < activeStep;
    const isCompleted = completedSteps[index];

    if (isGoingBack || isCompleted) {
      setActiveStep(index);
    }
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
