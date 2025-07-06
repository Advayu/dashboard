import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useFormContext } from "react-hook-form";

const PercentageOff = () => {
  const { register } = useFormContext();

  return (
    <div className="flex flex-col space-y-4">
      {/* First Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <Input
            {...register("discount_percent")}
            className="font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 w-2/5 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            type="text"
            name="discount_percent"
            placeholder="e.g 10%"
          />
          <Label className="font-black text-lg md:text-xl">OFF </Label>
        </div>
        {/* <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
          type="text"
          name="price"
          placeholder="Value"
          // Todo: review
          defaultValue={"All Items"}
          readOnly
        /> */}
      </div>

      {/* Second Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <Label className="font-black text-lg md:text-xl">above Rs.</Label>
          <Input
            {...register("min_order_value")}
            className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
            type="text"
            name="min_order_value"
            placeholder="e.g 1000"
          />
        </div>

        <div className="flex space-x-2">
          <Label className="font-black text-lg md:text-xl">upto Rs.</Label>
          <Input
            {...register("max_discount_value")}
            className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
            type="text"
            name="max_discount_value"
            placeholder="e.g 300"
          />
        </div>
      </div>
    </div>
  );
};

export default PercentageOff;
