import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const FlatOff = () => {
  return (
    <div className="flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center">
      <div className="flex items-center space-x-2">
        <Label className="font-black  text-lg md:text-xl">FLAT Rs.</Label>
        <Input
          type="text"
          placeholder="e.g 150"
          name="discountValue"
          className="font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label className="font-black  text-lg md:text-xl">OFF above Rs.</Label>
        <Input
          type="text"
          name="minOrderValue"
          placeholder="e.g 400"
          className="font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

export default FlatOff;
