import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const ComboOffers = () => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-start md:items-center">
      <Label className="font-medium text-lg md:text-xl">Combo Details:</Label>
      <Input
        className="border border-black text-lg md:text-xl w-full md:w-96 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        type="text"
        placeholder="Enter combo details"
      />
    </div>
  );
};

export default ComboOffers;
