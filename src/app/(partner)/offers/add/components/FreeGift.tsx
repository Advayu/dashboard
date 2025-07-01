import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const FreeGift = () => {
  return (
    <div className="flex flex-col space-y-4">
      {/* First Row */}
      <div className="flex flex-row space-x-4 space-y-2 md:space-y-0 items-center">
        <Label className="font-black text-lg md:text-xl">Get</Label>
        <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="text"
        />
        <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="text"
          name="text"
          placeholder="value"
          defaultValue="All items"
          readOnly
        />
        <Label className="font-black text-lg md:text-xl">Free</Label>
      </div>

      {/* Second Row */}
      <div className="flex flex-row space-x-2  md:space-y-0 items-center">
        <Label className="font-black text-lg md:text-xl">
          on all orders above Rs.
        </Label>
        <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          type="text"
        />
      </div>
    </div>
  );
};

export default FreeGift;
