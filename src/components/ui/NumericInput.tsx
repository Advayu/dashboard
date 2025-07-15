import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "./input";

interface NumericInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;

  placeholder?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  register,

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
    <div>
      <Input
        type="text"
        inputMode="numeric"
        onKeyDown={blockNonNumericKeys}
        {...register}
        {...rest}
        className="w-48 md:w-40"
      />
    </div>
  );
};

export default NumericInput;
