import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material";

const icons = {
  active: <RadioButtonCheckedIcon />,
  completed: <CheckCircleIcon className="QontoStepIcon-completedIcon" />,
  inactive: <RadioButtonUncheckedIcon className="text-gray-400" />,
};
export default function QontoStepIcon({
  active,
  completed,
}: {
  active?: boolean;
  completed?: boolean;
}) {
  const iconType = active ? "active" : completed ? "completed" : "inactive";
  return (
    <QontoStepIconRoot ownerState={{ active }}>
      {icons[iconType]}
    </QontoStepIconRoot>
  );
}

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
