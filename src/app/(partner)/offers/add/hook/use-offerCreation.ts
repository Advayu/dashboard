import { useState } from "react";

export default function useStepper(stepsCount: number) {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<boolean[]>(
        Array(stepsCount).fill(true)
    );

    const handleNext = () => {
        setCompletedSteps((prev) => {
            const newCompleted = [...prev];
            newCompleted[activeStep] = true;
            return newCompleted;
        });
        setActiveStep((prev) => prev + 1);
    };

    const handleStepClick = (index: number) => {
        if (
            index < activeStep ||
            index === activeStep ||
            (index === activeStep + 1 && completedSteps[activeStep])
        ) {
            setActiveStep(index);
        }
    };

    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

    return { activeStep, completedSteps, handleNext, handleStepClick, handleBack };
}