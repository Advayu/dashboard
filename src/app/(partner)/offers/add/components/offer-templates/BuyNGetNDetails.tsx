// components/offer-templates/BuyNGetNDetails.tsx
import React from "react";
import OfferRow from "../../components/OfferRow";
// import { OfferDetailsType } from "@/types"; // Adjust based on your types

interface Props {
  offer: any;
  subType: string;
}

const BuyNGetNDetails: React.FC<Props> = ({ offer, subType }) => {
  const { buyNGetN } = offer.conditions;

  if (subType === "Item") {
    return (
      <div className="space-y-4">
        <OfferRow label="Buy" value={buyNGetN?.buy || 0} />
        <OfferRow label="Get" value={buyNGetN?.get || 0} />
      </div>
    );
  }

  if (subType === "Percentage") {
    return (
      <div className="space-y-4">
        <OfferRow label="Buy" value={buyNGetN?.buy || 0} />
        <div className="flex items-center space-x-2">
          <OfferRow label="Get" value={buyNGetN?.get || 0} />
          <span className="font-black">OFF</span>
        </div>
      </div>
    );
  }

  if (subType === "Rupees") {
    return (
      <div className="space-y-4">
        <OfferRow label="Buy" value={buyNGetN?.buy || 0} />
        <div className="flex items-center space-x-2">
          <OfferRow label="Get Rs." value={buyNGetN?.get || 0} />
          <span className="font-black">OFF</span>
        </div>
      </div>
    );
  }

  return null;
};

export default BuyNGetNDetails;
