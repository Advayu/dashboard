import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DateRangeSelector = () => {
  const [startDate, setStartDate] = React.useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = React.useState<Date | undefined>(undefined);

  return (
    <div className="flex items-center ">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-[#F4F4F4] space-x-4 rounded-xl border border-black text-left font-normal",
              !startDate && "text-gray-400"
            )}>
            <span>
              {startDate ? format(startDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
            </span>
            <CalendarIcon className="h-[0.9rem] w-[0.9rem] text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date: Date | undefined) => setStartDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="h-[2px] w-4 bg-gray-300" />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "bg-[#F4F4F4] space-x-4 rounded-xl border border-black text-left font-normal",
              !endDate && "text-gray-400"
            )}>
            <span>
              {endDate ? format(endDate, "dd/MM/yyyy") : "DD/MM/YYYY"}
            </span>
            <CalendarIcon className="h-[0.9rem] w-[0.9rem] text-gray-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date: Date | undefined) => setEndDate(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelector;
