"use client";

import React from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "../hook/use-isMobile"; // Custom hook
import { QontoConnector } from "./QontoConnector"; // Styled component
import QontoStepIcon from "./QontoStepIcon"; // Step icon
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import Support from "/public/image/contact.svg";
import { getStepButtonProps } from "../utils";

interface Step {
  label: string;
}

interface OfferStepperLayoutProps {
  activeStep: number;
  completedSteps: boolean[];
  handleStepClick: (index: number) => void;
  handleBackClick: () => void;
  steps: Step[];
  children: React.ReactNode;
}

export default function OfferStepperLayout({
  activeStep,
  completedSteps,
  handleStepClick,
  handleBackClick,
  steps,
  children,
}: OfferStepperLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 w-full">
      {/* Navigation Bar */}
      <div className="flex justify-between my-10 mx-8 items-center">
        <button className="flex items-center" onClick={handleBackClick}>
          <ChevronLeft />
          <h1 className="md:text-3xl font-black"> New offer</h1>
        </button>
        <div className="md:flex hidden space-x-4 items-center">
          <h3 className="md:text-xl">support@advayu.club</h3>
          <h3 className="md:text-xl">+91 9660657811</h3>
        </div>
        <Image className="md:hidden block" src={Support} alt="support" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[370px_auto]">
        {/* Stepper Section */}
        <Box className="relative md:min-w-[370px] min-w-full">
          <h1 className="text-2xl font-bold md:block hidden">
            Easily create an offer
            <br />
            Complete these steps.
          </h1>
          <Stepper
            activeStep={activeStep}
            connector={<QontoConnector />}
            alternativeLabel={isMobile}
            orientation={isMobile ? "horizontal" : "vertical"}>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <button
                  {...getStepButtonProps(index, activeStep, completedSteps)}>
                  <StepLabel
                    className="font-bold md:text-xl text-xs"
                    StepIconComponent={QontoStepIcon}>
                    {step.label}
                  </StepLabel>
                </button>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Content Section */}
        <div className="mx-8 my-2">{children}</div>
      </div>
    </div>
  );
}
