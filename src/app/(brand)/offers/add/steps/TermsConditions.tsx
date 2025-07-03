import React from "react";
import dayjs from "dayjs";
import { useFormContext } from "react-hook-form";
import OfferDetailsShow from "../OfferDetailsShow";

const TermsConditions: React.FC = () => {
  const brandName = "shivam";
  const brand = { name: "advayu" };

  const { watch } = useFormContext();
  const applicableDays = watch("applicableDays") || [];
  const endDate = watch("endDate");

  const formattedDate = endDate
    ? dayjs(endDate).tz("Asia/Kolkata").format("DD MMM YYYY")
    : "N/A";

  const termsAndConditions = [
    <span key="1">
      Offer is valid at <b>{brandName}</b>&rsquo;s outlets
    </span>,
    <span key="3">
      Offer valid on <b>{applicableDays.join(", ")}</b>
    </span>,
    <span key="4">
      Offer valid till <b>{formattedDate}</b>
    </span>,
    <span key="6">
      Discount can only be availed when paying your bill at <b>{brand?.name}</b>
    </span>,
    <span key="8">
      Once redeemed, the offer cannot be modified or transferred
    </span>,
    <span key="9">The offer is guaranteed</span>,
    <span key="10">
      <b>Advayu</b> shall not be responsible for any loss you may incur
    </span>,
  ];

  const offerDetails = watch();
  return (
    <div className="p-4 bg-white rounded">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-bold text-2xl md:text-3xl">Terms and Conditions</h1>
        <p className="text-gray-600 text-sm">Set offer conditions</p>
      </div>

      {/* <OfferDetailsShow {...offerDetails} /> */}

      {/* T&C List */}
      <ul className="list-disc pl-6 mt-6 text-gray-800">
        {termsAndConditions.map((item, idx) => (
          <li key={idx} className="text-sm md:text-base py-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TermsConditions;
