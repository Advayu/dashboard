import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface NumericInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  label,
  register,
  error,
  ...rest
}) => {
  const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
    ];
    if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        onKeyDown={blockNonNumericKeys}
        {...register}
        {...rest}
        className="w-48 md:w-40"
      />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default NumericInput;
