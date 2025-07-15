import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import NumericInput from "@/components/ui/NumericInput";
import { error } from "console";
import React from "react";
import { useFormContext } from "react-hook-form";

const FlatOff = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="bg-white border  rounded-xl p-6 shadow-sm space-y-4 transition-all duration-200 border-teal-500 max-w-[30vw]">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Flat Discount
      </h3>
      <div className="flex flex-col md:flex-row gap-6 md:items-end">
        {/* Flat Discount */}
        <div className="flex flex-col">
          <Label
            htmlFor="discount_value"
            className="text-sm font-medium text-muted-foreground mb-1">
            Flat Discount (Rs.)
          </Label>
          <div>
            {" "}
            <NumericInput
              placeholder="eg. 150"
              register={{
                ...register("discount_value", {
                  required: { value: true, message: "Please enter a value" },
                }),
              }}
            />
            {errors && errors.discount_value && (
              <p className="text-red-500 text-xs">
                {errors?.discount_value?.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Minimum Order */}
        <div className="flex flex-col">
          <Label
            htmlFor="min_order_value"
            className="text-sm font-medium text-muted-foreground mb-1">
            Min Order Value (Rs.)
          </Label>
          <div>
            {" "}
            <NumericInput
              register={{
                ...register("min_order_value", {
                  required: { value: true, message: "Please enter a value" },
                }),
              }}
              placeholder="e.g. 400"
            />
            {errors && errors.min_order_value && (
              <p className="text-red-500 text-xs">
                {errors?.min_order_value?.message?.toString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatOff;
