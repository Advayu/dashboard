import handleStepClick from "./hook/use-offerCreation";

export function getStepButtonProps(index: number, activeStep: number, completedSteps: boolean[]) {
    const isDisabled = index > activeStep && !completedSteps[activeStep];
    return {
        onClick: () => !isDisabled && handleStepClick(index),
        disabled: isDisabled,
        "aria-disabled": isDisabled,
        className: isDisabled ? "cursor-not-allowed opacity-50" : "",
    };
}

