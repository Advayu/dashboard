import React from "react";
import { useStepper } from "../contexts/StepperContext";
import { QontoConnector } from "../components/QontoConnector";
import { useIsMobile } from "../hook/use-isMobile";
import QontoStepIcon from "../components/QontoStepIcon";
import { Box } from "@mui/system";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const StepperLayout = () => {
  const { activeStep, handleStepClick, completedSteps, steps } = useStepper();
  const isMobile = useIsMobile();

  return (
    <div>
      <div className="relative md:min-w-[370px] min-w-full ">
        <Box className="md:pl-24 md:h-[50vh] md:pb-0	pb-10   relative rounded-b-full md:left-[-65px] md:bg-gradient-to-t from-blueTilt/10 to-blueTilt/0">
          <div>
            <h1 className="text-2xl font-bold md:block hidden">
              Easily create an offer
              <br />
              complete these steps.
            </h1>
          </div>

          <Stepper
            alternativeLabel={isMobile ? true : false}
            activeStep={activeStep}
            connector={<QontoConnector />}
            orientation={isMobile ? "horizontal" : "vertical"}
            className="hidden md:block md:mt-4 md:mx-0 md:bg-inherit md:pb-0 pb-4	pt-4 bg-[#F3F3F3] md:shadow-none shadow-lg">
            {steps.map((step, index) => {
              const isDisabled = index > activeStep && !completedSteps[index];

              return (
                <Step key={step.label}>
                  <button
                    type="button"
                    onClick={() => handleStepClick(index)}
                    disabled={isDisabled}
                    className={`${
                      isDisabled ? "cursor-not-allowed opacity-50" : ""
                    } w-full text-left`}>
                    <StepLabel
                      className="font-bold md:text-xl text-xs"
                      StepIconComponent={QontoStepIcon}>
                      {step.label}
                    </StepLabel>
                  </button>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </div>
    </div>
  );
};

export default StepperLayout;
