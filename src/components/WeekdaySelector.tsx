import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Label } from "./ui/label";
import { daysOfWeek } from "@/utils/constants";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface DaysOpenSelectorProps {
  name: string; // Field name
}

const WeekdaySelector: React.FC<DaysOpenSelectorProps> = ({ name }) => {
  const { control } = useFormContext(); // Access control from context

  return (
    <div className="my-6">
      <Label className="text-base md:text-lg font-bold">
        Days Open in a Week
      </Label>

      <div className="mt-2 flex flex-wrap gap-2 items-center">
        <Controller
          name={name}
          control={control}
          defaultValue={[]} // Default value
          render={({ field: { value, onChange } }) => {
            const allDaysSelected =
              Array.isArray(value) &&
              value.length === daysOfWeek.length &&
              daysOfWeek.every((day) => value.includes(day.value));

            return (
              <>
                <ToggleGroup
                  type="multiple"
                  className="flex flex-wrap gap-2"
                  value={value}
                  onValueChange={onChange}>
                  {daysOfWeek.map(({ display, value }) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="cursor-pointer">
                      {display}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>

                <button
                  type="button"
                  className={`ml-2 px-2 py-1 rounded ${
                    allDaysSelected ? "bg-red-500" : "bg-blueTilt"
                  } text-white`}
                  onClick={() =>
                    onChange(
                      allDaysSelected ? [] : daysOfWeek.map((day) => day.value)
                    )
                  }>
                  {allDaysSelected ? "Deselect All" : "Select All"}
                </button>
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default WeekdaySelector;
