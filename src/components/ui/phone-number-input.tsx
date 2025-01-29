import * as React from "react";
import { cn } from "@/lib/utils";

interface PhoneNumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  disable?: boolean;
  // Add a prop to indicate an error
}

const PhoneNumberInput = React.forwardRef<HTMLInputElement, PhoneNumberInputProps>(
  ({ className, error, disable, ...props }, ref) => {



    return (
      <div
      aria-disabled={disable}
        className={cn(
          "mt-2 flex items-center space-x-2 w-full  border rounded-md",
          error ? "border-red-500" : "border-black", 
          disable ? "text-gray-600 cursor-not-allowed" : "" ,
          // Conditional border color
        )}
      >
        {/* Non-editable +91 prefix */}
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-l-md border-r border-black">
          +91
        </span>
        {/* Input field for phone number */}
        <input
          disabled = {disable}
          ref={ref}
          type="tel"
          name="phone"
          maxLength={10}
          minLength={10}
          pattern="[0-9]{10}"
          inputMode="numeric"
          className={cn("flex-1 outline-none", disable ? "cursor-not-allowed text-gray-400" : "" ,className)} // Allow extending styles
          placeholder="Enter your phone number"
          {...props} // Spread the props for customizability (e.g., onChange, value, etc.)
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };