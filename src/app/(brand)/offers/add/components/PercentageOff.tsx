import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NumericInput from "@/components/ui/NumericInput";
import React from "react";
import { useFormContext } from "react-hook-form";

const PercentageOff = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white border  rounded-xl p-6 shadow-sm space-y-4 transition-all duration-200 border-teal-500 ">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Percentage Discount
      </h3>
      <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
        {/* Discount Percentage */}
        <div className="flex flex-col">
          <Label
            htmlFor="discount_percent"
            className="text-sm font-medium text-gray-700">
            Discount Percentage
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="eg. 10"
              type="text"
              inputMode="numeric"
              onKeyDown={(e) => {
                const allowedKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                ];
                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              {...register("discount_percent", {
                required: "This field is required",
                min: { value: 1, message: "Min is 1" },
                max: { value: 100, message: "Max is 100" },
              })}
            />
            <span className="font-semibold text-base text-muted-foreground">
              %
            </span>
          </div>
          {errors.discount_percent && (
            <p className="text-red-500 text-xs">
              {errors?.discount_percent?.message?.toString()}
            </p>
          )}
        </div>

        {/* Min Order Value */}
        <div className="flex flex-col">
          <Label
            htmlFor="min_order_value"
            className="text-sm font-medium text-gray-700">
            Minimum Order Value
          </Label>
          <Input
            {...register("min_order_value")}
            id="min_order_value"
            type="text"
            placeholder="e.g. 1000"
            className="w-48 md:w-40"
          />
        </div>

        {/* Max Discount Cap */}
        <div className="flex flex-col">
          <Label
            htmlFor="max_discount_value"
            className="text-sm font-medium text-gray-700">
            Maximum Discount Cap
          </Label>
          <Input
            {...register("max_discount_value")}
            id="max_discount_value"
            type="text"
            placeholder="e.g. 300"
            className="w-48 md:w-40"
          />
        </div>
      </div>
    </div>
  );
};

export default PercentageOff;
