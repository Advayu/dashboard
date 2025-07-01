import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";

const BuyNGetN = () => {
  return (
    <div className="space-x-4 border border-black px-2 rounded-md mb-4">
      {/* Toggle Group */}
      <ToggleGroup type="single" className="space-x-2">
        <ToggleGroupItem value="Percentage">%</ToggleGroupItem>
        <ToggleGroupItem value="Rupees">Rs.</ToggleGroupItem>
        <ToggleGroupItem value="Item">Item</ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default BuyNGetN;
