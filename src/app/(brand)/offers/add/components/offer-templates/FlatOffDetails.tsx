// components/offer-templates/FlatOffDetails.tsx
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import { OfferDetailsType } from "@/types"; // Replace with actual type if available

interface Props {
  offer: any;
}

const FlatOffDetails: React.FC<Props> = ({ offer }) => {
  const { discountValue, minOrderValue } = offer;

  return (
    <div className="flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center">
      {/* Flat Rs. */}
      <div className="flex items-center space-x-2">
        <Label className="font-black text-lg md:text-xl">FLAT Rs.</Label>
        <Input
          type="number"
          readOnly
          value={discountValue}
          className="bg-inputDisable font-bold text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
        />
      </div>

      {/* OFF above Rs. */}
      <div className="flex items-center space-x-2">
        <Label className="font-black text-lg md:text-xl">OFF above Rs.</Label>
        <Input
          type="number"
          readOnly
          value={minOrderValue}
          className="bg-inputDisable font-bold text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
        />
      </div>
    </div>
  );
};

export default FlatOffDetails;
