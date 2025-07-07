import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";

const PercentageOff = () => {
  const { register } = useFormContext();

  return (
    <div className="bg-white border  rounded-xl p-6 shadow-sm space-y-4 transition-all duration-200 border-teal-500 max-w-[45vw]">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Percentage Discount
      </h3>
      <div className="flex flex-col md:flex-row gap-6 md:items-end">
        {/* Discount Percentage */}
        <div className="flex flex-col">
          <Label
            htmlFor="discount_percent"
            className="text-sm font-medium text-gray-700">
            Discount Percentage
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              {...register("discount_percent")}
              id="discount_percent"
              type="text"
              placeholder="e.g. 10"
              className="w-48 md:w-40"
            />
            <span className="font-semibold text-base text-muted-foreground">
              %
            </span>
          </div>
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
