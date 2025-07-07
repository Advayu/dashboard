import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";

const FlatOff = () => {
  const { register } = useFormContext();

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
          <Input
            {...register("discount_value")}
            id="discount_value"
            type="text"
            placeholder="e.g. 150"
            className="w-48 md:w-40" // fixed width on larger screens
          />
        </div>

        {/* Minimum Order */}
        <div className="flex flex-col">
          <Label
            htmlFor="min_order_value"
            className="text-sm font-medium text-muted-foreground mb-1">
            Min Order Value (Rs.)
          </Label>
          <Input
            {...register("min_order_value")}
            id="min_order_value"
            type="text"
            placeholder="e.g. 400"
            className="w-48 md:w-40"
          />
        </div>
      </div>
    </div>
  );
};

export default FlatOff;
