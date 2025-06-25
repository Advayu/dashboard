import React from "react";
import { useFormContext } from "react-hook-form";

interface TimeSelectorProps {
  name: string; // Field name in the form
  label: string; // Label for the time selector
  times: string[]; // Array of time values
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ name, label, times }) => {
  const { register } = useFormContext(); // Access form context

  const renderTimeOptions = () =>
    ["AM", "PM"].flatMap((period) =>
      times.map((time) => (
        <option key={`${time}-${period}`} value={`${time}:00 ${period}`}>
          {time}:00 {period}
        </option>
      ))
    );

  return (
    <div className="my-6">
      <label className="text-base md:text-lg font-bold">{label}</label>
      <select
        {...register(name)}
        className="mt-1 py-1 px-1 border rounded w-full">
        <option value="">{label}</option>
        {renderTimeOptions()}
      </select>
    </div>
  );
};

export default TimeSelector;
