"use client";
import { useState, useEffect } from "react";
import shape from "../../../../../public/shape5.png";
import Support from "/public/image/contact.svg";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Provider } from "react-redux";
// import createOfferStore from "@/store/createOfferStore";
import store from "@/store/store";
import resolveConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../../../../../tailwind.config"; // Your tailwind config path

import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// mui steper imports
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// mui icons for steper

import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";
import { useMediaQuery, useTheme } from "@mui/material";

// components
import OfferDetails from "./steps/OfferDetails";
import RedemptionDetails from "./steps/RedemptionDetails";
import TermsConditions from "./steps/TermsConditions";
import CouponPreview from "./steps/CouponPreview";

interface StepProps {
  handleNext: () => void;
  activeStep: number;
}

// steper connector modify

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: "#199EAD",
    borderLeftStyle: "dashed",
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      borderTopStyle: "dashed", // Apply on smaller screens
      borderLeftStyle: "none", // Disable left border for smaller screens
    },
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: "#199EAD",
    borderTopStyle: "none",
    borderBottomStyle: "dashed",
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      borderTopStyle: "dashed", // Apply on smaller screens
      borderBottomStyle: "none", // Disable bottom border for smaller screens
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#bec0c7",
    borderLeftStyle: "dashed",
    // borderTopStyle: "dashed",
    borderLeftWidth: 3,
    // borderTopWidth: 3,
    [theme.breakpoints.down("sm")]: {
      borderTopStyle: "dashed", // Always dashed for smaller screens
      borderTopWidth: 3,
      borderLeftStyle: "none", // Disable left border for smaller screens
    },
  },
}));

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#199EAD",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#199EAD",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#199EAD",
      zIndex: 1,
    },
    "& .QontoStepIcon-circle": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor",
    },
  })
);

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {active ? (
        <RadioButtonCheckedIcon />
      ) : completed ? (
        <CheckCircleIcon className="QontoStepIcon-completedIcon" />
      ) : (
        <RadioButtonUncheckedIcon className="text-gray-400" />
      )}
    </QontoStepIconRoot>
  );
}

const steps = [
  {
    label: "Offer details",
    component: (props: StepProps) => <OfferDetails {...props} />,
  },
  {
    label: "Redemption details",
    component: (props: StepProps) => <RedemptionDetails {...props} />,
  },
  {
    label: "Terms and Conditions",
    component: (props: StepProps) => <TermsConditions {...props} />,
  },
  {
    label: "Preview",
    component: (props: StepProps) => <CouponPreview {...props} />,
  },
];

export default function Page() {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const fullConfig = resolveConfig(tailwindConfig);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  // Extract the 'md' breakpoint from Tailwind's config
  // Tailwind breakpoints are like { 'md': '768px' }
  const mdBreakpoint = fullConfig.theme.screens.md;

  // Convert Tailwind breakpoint to px number (removes 'px' suffix)
  const mdBreakpointNumber = parseInt(mdBreakpoint);

  // Use the Tailwind breakpoint in useMediaQuery
  const isMobile = useMediaQuery(`(max-width:${mdBreakpointNumber}px)`);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const handleNext = () => {
    setCompletedSteps((prev) => {
      const newCompleted = [...prev];
      newCompleted[activeStep] = true;
      return newCompleted;
    });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleStepClick = (index: number) => {
    // Allow clicking only if:
    // 1. Going to a previous step
    // 2. Going to the current step
    // 3. Going to the next available step if previous step is completed
    if (
      index < activeStep || // Previous steps
      index === activeStep || // Current step
      (index === activeStep + 1 && completedSteps[activeStep]) // Next step if current is completed
    ) {
      setActiveStep(index);
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // handle back click to go back to previous page
  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  // Logic to make stepper vertical and horizontal

  // Handle initial render
  useEffect(() => {
    // Short timeout to ensure media query is evaluated
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Don't render until media query is evaluated
  if (isLoading) {
    return null; // or a loading skeleton/placeholder
  }

  return (
    <>
      <Provider store={store}>
        <div className="grid grid-cols-1 w-[100%]">
          {/* nav bar  */}
          <div className="flex justify-between my-10 mx-8 items-center">
            <div className="flex items-center">
              <button className="flex  items-center" onClick={handleBackClick}>
                <ChevronLeft />
                <h1 className="md:text-3xl	font-black"> New offer</h1>
              </button>
            </div>
            <div className=" md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
              <h3 className="md:text-xl text-xs">support@advayu.club</h3>
              <h3 className="md:text-xl text-xs">+91 9660657811</h3>
            </div>
            <Image className="md:hidden block" src={Support} alt="support" />
          </div>

          <div className="grid grid-cols-1  md:grid-cols-[370px_auto] ">
            <div className="relative md:min-w-[370px] min-w-full">
              <Box className="md:pl-24 md:h-[23rem] md:pb-0	pb-10   relative rounded-b-full md:left-[-65px] md:bg-gradient-to-t from-blueTilt/10 to-blueTilt/0">
                {/* <Image className=" z-[-10] absolute  transform  rotate-360  max-w-[300px]" src={shape} alt="shape" width={400} height={400} /> */}
                <div>
                  <h1 className="text-2xl font-bold md:block hidden">
                    Easily create an offer
                    <br />
                    complete these steps.
                  </h1>
                </div>
                {/* connector={<QontoConnector />} */}
                <Stepper
                  alternativeLabel={isMobile ? true : false}
                  activeStep={activeStep}
                  connector={<QontoConnector />}
                  orientation={isMobile ? "horizontal" : "vertical"}
                  className="hidden md:block md:mt-4 md:mx-0 md:bg-inherit md:pb-0 pb-4	pt-4 bg-[#F3F3F3] md:shadow-none shadow-lg">
                  {steps.map((step, index) => (
                    <Step key={step.label}>
                      <button
                        onClick={() => handleStepClick(index)}
                        className={`${
                          index > activeStep && !completedSteps[activeStep]
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        key={step.label}>
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
            </div>
            <div className="mx-8 my-2">
              {typeof steps[activeStep].component === "function"
                ? steps[activeStep].component({ handleNext, activeStep })
                : steps[activeStep].component}
            </div>
          </div>
        </div>
      </Provider>
    </>
  );
}
