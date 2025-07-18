import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  disable?: boolean;
  // Add a prop to indicate an error
}
 const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  PhoneNumberInputProps
>(({ className, error, disable, ...props }, ref) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab",
    ];
    if (
      !/^\d$/.test(event.key) && // Not a digit
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  return (
    <div
      aria-disabled={disable}
      className={cn(
        "flex items-center space-x-2 w-full border rounded-md",
        error ? "border-red-500" : "border-black",
        disable ? "text-gray-600 cursor-not-allowed" : ""
      )}
    >
      <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border-r border-black">
        +91
      </span>
      <input
        disabled={disable}
        ref={ref}
        type="tel"
        name="phone"
        maxLength={10}
        minLength={10}
        pattern="[0-9]{10}"
        inputMode="numeric"
        onKeyDown={handleKeyDown}
        className={cn(
          "flex-1 outline-none py-2",
          disable ? "cursor-not-allowed text-gray-400" : "",
          className
        )}
        placeholder="Enter your phone number"
        {...props}
      />
    </div>
  );
});

export default PhoneNumberInput;