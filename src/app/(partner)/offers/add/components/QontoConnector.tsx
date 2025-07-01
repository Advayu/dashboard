import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/system";

export const QontoConnector = styled(StepConnector)(({ theme }) => ({
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
      borderTopStyle: "dashed",
      borderLeftStyle: "none",
    },
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: "#199EAD",
    borderTopStyle: "none",
    borderBottomStyle: "dashed",
    fontWeight: 700,
    [theme.breakpoints.down("sm")]: {
      borderTopStyle: "dashed",
      borderBottomStyle: "none",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#bec0c7",
    borderLeftStyle: "dashed",
    borderLeftWidth: 3,
    [theme.breakpoints.down("sm")]: {
      borderTopStyle: "dashed",
      borderTopWidth: 3,
      borderLeftStyle: "none",
    },
  },
}));
