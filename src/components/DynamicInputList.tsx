"use client";
import React from "react";
import { useWatch, useFormContext } from "react-hook-form";

interface DynamicInputListProps {
  fieldName: string; // e.g. 'items.0.service'
  label: string;
  placeholder: string;
  index: number;
}

export const DynamicInputList: React.FC<DynamicInputListProps> = ({
  fieldName,
  label,
  placeholder,
  index,
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
    <div className="my-3">
      <label className="text-base md:text-lg font-bold block mb-2">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder={placeholder}
          className="border border-black rounded p-2 pr-20 w-full"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
          Add
        </button>
      </div>
      <ul className="mt-2 space-y-1">
        {values.map((val, i) => (
          <li
            key={i}
            className="flex justify-between items-center text-sm bg-gray-100 px-2 py-1 rounded">
            {val}
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-red-500 text-xs ml-2">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
