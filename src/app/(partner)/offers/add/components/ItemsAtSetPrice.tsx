import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const ItemsAtSetPrice = () => {
  return (
    <div className="flex  space-y-4 md:flex-row flex-col md:space-y-0 md:space-x-4  md:items-center">
      <div className="flex items-center space-x-2">
        <Label className="font-black text-lg md:text-xl ">Get</Label>
        <Select
          defaultValue="1" // Use a string to match the `value` types
        >
          <SelectTrigger className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">All items</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label className="font-black text-lg md:text-xl">at Rs.</Label>
        <Input
          className="font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-24"
          type="number"
          name="value"
          placeholder="value"
        />
      </div>
    </div>
  );
};

export default ItemsAtSetPrice;
