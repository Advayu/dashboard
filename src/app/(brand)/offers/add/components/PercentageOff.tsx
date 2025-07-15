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
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
        {/* Discount Percentage */}

        <div className="flex flex-col  ">
          <div className="flex flex-col  flex-row">
            <Label className="mb-2"> Discount Percentage</Label>
            <div className="flex flex-row items-center gap-2">
              <NumericInput
                placeholder="eg. 10"
                register={register("discount_percent", {
                  required: {
                    value: true,
                    message: "Discount Percentage is required",
                  },
                  max: { value: 100, message: "Maximum value is 100" },
                })}
              />

              <span className="font-semibold text-base  text-muted-foreground">
                %
              </span>
            </div>
          </div>
          {errors.discount_percent && (
            <p className="text-red-500 text-xs">
              {errors?.discount_percent?.message?.toString()}
            </p>
          )}
        </div>

        {/* Min Order Value */}

        <div className="flex flex-col">
          <Label className="mb-2">Minimum Order Value</Label>
          <div>
            <NumericInput
              placeholder="e.g. 1000"
              register={{
                ...register("min_order_value", {
                  required: { value: true, message: "Please enter a value" },
                }),
              }}
            />
          </div>
          {errors.min_order_value && (
            <p className="text-red-500 text-xs">
              {errors?.min_order_value?.message?.toString()}
            </p>
          )}
        </div>

        {/* Max Discount Cap */}
        <div className="flex flex-col">
          <Label className="mb-2"> Maximum Discount Cap</Label>
          <div>
            {" "}
            <NumericInput
              placeholder="e.g. 300"
              register={{
                ...register("max_discount_value", {
                  required: { value: true, message: "Please enter a value" },
                }),
              }}
            />
          </div>
          {errors.max_discount_value && (
            <p className="text-red-500 text-xs">
              {errors?.max_discount_value?.message?.toString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PercentageOff;
