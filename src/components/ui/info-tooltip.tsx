import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Info } from "lucide-react";

export const InfoTooltip: React.FC<{ message: string }> = ({ message }) => (
  <Tooltip>
    <TooltipTrigger>
      <Info className="mx-2" size={15} />
    </TooltipTrigger>
    <TooltipContent>
      <p>{message}</p>
    </TooltipContent>
  </Tooltip>
);
