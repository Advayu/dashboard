import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9  rounded-md border border-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"




interface ReadOnlyInputProps {
  label: string;
  id: string;
  defaultValue?: string;
  inputClassName?: string;
  labelClassName?: string;
  containerClassName?: string;
}

const ReadOnlyInput: React.FC<ReadOnlyInputProps> = ({
  label,
  id,
  defaultValue = "",
  inputClassName,
  labelClassName,
  containerClassName,
}) => {
  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <label
        htmlFor={id}
        className={cn("text-lg font-medium", labelClassName)}
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        defaultValue={defaultValue}
        readOnly
        className={cn(
          "w-full bg-gray-100 border-none text-black font-bold px-3 py-1 rounded-md text-wrap",
          inputClassName
        )}
      />
    </div>
  );
};




export { Input, ReadOnlyInput }
