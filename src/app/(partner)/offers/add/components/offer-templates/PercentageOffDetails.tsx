// components/offer-templates/PercentageOffDetails.tsx
import React from "react";
import OfferRow from "../../components/OfferRow";
// import { OfferDetailsType } from "@/types"; // Adjust to your project’s type

interface Props {
  offer: any;
}

const PercentageOffDetails: React.FC<Props> = ({ offer }) => {
  const { discountValue, minOrderValue, maxDiscountValue } = offer;

  return (
    <div className="flex flex-col space-y-4">
      {/* First Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <OfferRow value={discountValue || 0} />
          <span className="font-black text-lg md:text-xl">OFF on</span>
        </div>
        <OfferRow value="All Items" />
      </div>

      {/* Second Row */}
      <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
        <div className="flex space-x-2">
          <span className="font-black text-lg md:text-xl">above Rs.</span>
          <OfferRow value={minOrderValue || 0} />
        </div>
        <div className="flex space-x-2">
          <span className="font-black text-lg md:text-xl">upto Rs.</span>
          <OfferRow value={maxDiscountValue || 0} />
        </div>
      </div>
    </div>
  );
};

export default PercentageOffDetails;
