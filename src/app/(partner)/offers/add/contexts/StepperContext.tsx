import { createContext, useContext, useState } from "react";

interface StepperContextType {
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  setActiveStep: (step: number) => void;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined);

export const StepperProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <StepperContext.Provider
      value={{ activeStep, setActiveStep, handleNext, handleBack }}>
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
