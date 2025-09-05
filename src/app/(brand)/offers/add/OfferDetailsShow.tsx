"use client";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateOfferTitle } from "./generateOfferTitle";
import BuyNGetNDetails from "./components/offer-templates/BuyNGetNDetails";
import PercentageOffDetails from "./components/offer-templates/PercentageOffDetails";
import FlatOffDetails from "./components/offer-templates/FlatOffDetails";

const OfferDetailsShow: React.FC<any> = ({ ...offerDetail }) => {
  const subCategoryDiscountType = offerDetail.discountType;

  useEffect(() => {
    const title = generateOfferTitle(offerDetail);
    console.log("Generated Title:", title);
  }, [offerDetail]);

  return (
    <>
      {offerDetail.discountType === "Flat off" && (
        <FlatOffDetails offer={offerDetail} />
      )}

      {offerDetail.discountType === "Percentage off" && (
        <PercentageOffDetails offer={offerDetail} />
      )}

      {offerDetail.discountType === "Buy n Get n" && (
        <BuyNGetNDetails
          offer={offerDetail}
          subType={subCategoryDiscountType}
        />
      )}

      {offerDetail.discountType === "Free gift" && (
        <div className="flex flex-col space-y-4">
          {/* First Row */}
          <div className="flex flex-row space-x-4 space-y-2 md:space-y-0 items-center">
            <Label className="font-black text-lg md:text-xl">Get</Label>
            <Input
              readOnly
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              type="text"
              value="20%"
            />
            <Input
              readOnly
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              type="text"
              name="text"
              placeholder="value"
              value="All items"
            />
            <Label className="font-black text-lg md:text-xl">Free</Label>
          </div>

          {/* Second Row */}
          <div className="flex flex-row space-x-2  md:space-y-0 items-center">
            <Label className="font-black text-lg md:text-xl">
              on all orders above Rs.
            </Label>
            <Input
              readOnly
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              type="text"
              value={899}
            />
          </div>
        </div>
      )}

      {offerDetail.discountType === "Items at set price" && (
        <div className="flex  space-y-4 md:flex-row flex-col md:space-y-0 md:space-x-4  md:items-center">
          <div className="flex items-center space-x-2">
            <Label className="font-black text-lg md:text-xl ">Get</Label>
            <Input
              readOnly
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              type="number"
              placeholder="Value"
              value={offerDetail.maxDiscountValue}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label className="font-black text-lg md:text-xl">at Rs.</Label>
            <Input
              readOnly
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-24"
              type="number"
              name="value"
              placeholder="value"
              value={offerDetail.minOrderValue || ""}
            />
          </div>
        </div>
      )}

      {offerDetail.discountType === "Combo offers" && (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-start md:items-center">
          <Label className="font-medium text-lg md:text-xl">
            Combo Details:
          </Label>
          <Input
            readOnly
            className="bg-inputDisable border-none border border-black text-lg md:text-xl w-full md:w-96 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
            type="text"
            placeholder="Enter combo details"
            value={offerDetail.conditions.comboOffer?.comboDetails || ""}
          />
        </div>
      )}
    </>
  );
};

export default OfferDetailsShow;
