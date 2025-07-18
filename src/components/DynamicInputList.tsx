"use client";
import React from "react";
import { useWatch, useFormContext } from "react-hook-form";
import { Button } from "./ui/button";

interface DynamicInputListProps {
  fieldName: string; // e.g. 'items.0.service'
  label: string;
  placeholder: string;
  index?: number;
  className?: string;
}

export const DynamicInputList: React.FC<DynamicInputListProps> = ({
  fieldName,
  label,
  placeholder,
  className,
}) => {
  const { setValue } = useFormContext();
  const values: string[] = useWatch({ name: fieldName }) || [];
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    const updated = [...values, input.trim()];
    setValue(fieldName, updated);
    setInput("");
  };

  const handleRemove = (i: number) => {
    const updated = values.filter((_, idx) => idx !== i);
    setValue(fieldName, updated);
  };

  return (
    <div className={`my-4 ${className} `}>
      <label className="text-base md:text-lg font-semibold block mb-2">
        {label}
      </label>

      {/* Input + Add Button */}
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="border border-gray-300 rounded px-3 py-2  sm:w-auto flex-grow"
        />
        <Button
          type="button"
          onClick={handleAdd}
          className=" text-white px-4 py-2 rounded  sm:w-auto">
          Add
        </Button>
      </div>

      {/* Value List */}
      <ul className="mt-3 space-y-2 max-h-[80px] overflow-y-auto ">
        {values.map((val, i) => (
          <li
            key={i}
            className="flex justify-between items-center bg-gray-100 rounded px-3 py-2 text-sm max-h-[2.5rem] overflow-y-auto">
            <span className="break-words max-w-[80%]">{val}</span>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-red-500 text-xs hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
