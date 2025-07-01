import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const PercentageOff = () => {
  return (
    <div className="flex flex-col space-y-4">
      {/* First Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <Input
            className="font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 w-2/5 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            type="text"
            name="discountValue"
            placeholder="e.g 10%"
          />
          <Label className="font-black text-lg md:text-xl">OFF on</Label>
        </div>
        <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
          type="text"
          name="price"
          placeholder="Value"
          // Todo: review
          value={"All Items"}
          readOnly
        />
      </div>

      {/* Second Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <Label className="font-black text-lg md:text-xl">above Rs.</Label>
          <Input
            className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
            type="text"
            name="minOrderValue"
            placeholder="e.g 1000"
          />
        </div>

        <div className="flex space-x-2">
          <Label className="font-black text-lg md:text-xl">upto Rs.</Label>
          <Input
            className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
            type="text"
            name="maxDiscountValue"
            placeholder="e.g 300"
          />
        </div>
      </div>
    </div>
  );
};

export default PercentageOff;
