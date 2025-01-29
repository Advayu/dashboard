"use client";
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { useSelector } from "react-redux";
import { setOfferfield } from "@/store/offerSlice/offerDetailsSlice";
import { useDispatch } from "react-redux";
import { generateOfferTitle } from "./generateOfferTitle";

const OfferDetailsShow: React.FC = () => {
  const offerDetail = useSelector((state: any) => state.offerDetails);
  const dispatch = useDispatch();

  const subCategoryDiscountType = offerDetail.discountType.split(",")[1];

  const [fullText, setFullText] = useState("");

  useEffect(() => {
    const title = generateOfferTitle(offerDetail);
    console.log("Generated Title:", title);
    dispatch(setOfferfield({ field: "title", value: title }));
  }, [offerDetail, dispatch]);

  return (
    <>
      {offerDetail.discountType === "Flat off" && (
        <div className="flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center">
          <div className="flex items-center space-x-2">
            <Label className="font-black  text-lg md:text-xl">FLAT Rs.</Label>
            <Input
              type="number"
              placeholder="Value"
              name="flatRs"
              readOnly
              value={offerDetail?.discountValue}
              className="bg-inputDisable font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label className="font-black  text-lg md:text-xl">
              OFF above Rs.
            </Label>
            <Input
              readOnly
              type="number"
              name="offAboveRs"
              placeholder="Value"
              value={offerDetail?.minOrderValue}
              className="bg-inputDisable font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
            />
          </div>
        </div>
      )}

      {offerDetail.discountType === "Percentage off" && (
        <div className="flex flex-col space-y-4">
          {/* First Row */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
            <div className="flex space-x-2">
              <Input
                readOnly
                className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 w-2/5 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                type="text"
                value={offerDetail.discountValue || 0}
                name="discountValue"
              />
              <Label className="font-black text-lg md:text-xl">OFF on</Label>
            </div>
            <Input
              className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
              type="text"
              name="price"
              placeholder="Value"
              // Todo: review
              value={"All Items"}
              readOnly
              // onChange={(e) =>
              //   handlePercentageOffChange(
              //     offerDetails.conditions.percentageOff?.percentage || 0,
              //     Number(e.target.value),
              //     offerDetails.conditions.percentageOff?.abovePurchase || 0,
              //     offerDetails.conditions.percentageOff?.uptoDiscount || 0
              //   )
              // }
            />
          </div>

          {/* Second Row */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
            <div className="flex space-x-2">
              <Label className="font-black text-lg md:text-xl">above Rs.</Label>
              <Input
                readOnly
                className="bg-inputDisable border-none  font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
                type="text"
                name="minOrderValue"
                value={offerDetail.minOrderValue || 0}
              />
            </div>

            <div className="flex space-x-2">
              <Label className="font-black text-lg md:text-xl">upto Rs.</Label>
              <Input
                readOnly
                className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
                type="text"
                name="maxDiscountValue"
                placeholder="Value"
                value={offerDetail.maxDiscountValue || 0}
              />
            </div>
          </div>
        </div>
      )}

      {offerDetail.discountType === "Buy n Get n" && (
        <>
          {subCategoryDiscountType === "Item" && (
            <div>
              {/* Buy Section */}
              <div className="flex items-center space-x-4">
                <Label className="font-black text-lg md:text-xl">Buy</Label>
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.buy || 0}
                />
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-40 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.buy || 0}
                />
              </div>

              {/* Get Section */}
              <div className="flex items-center space-x-4 mt-4">
                <Label className="font-black text-lg md:text-xl">Get</Label>
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.get || 0}
                />
                <Input
                  readOnly
                  className="bg-inputDisable border-none  font-black border border-black text-lg md:text-xl text-blueTilt w-40 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.get || 0}
                />
              </div>
            </div>
          )}

          {subCategoryDiscountType === "Percentage" && (
            <div>
              <div className="bg-inputDisable border-none flex items-center space-x-4">
                <Label className="font-black text-lg md:text-xl">Buy</Label>
                <Input
                  readOnly
                  className="font-black border border-black text-lg md:text-xl text-blueTilt  w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 "
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.buy || 0}
                />
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.buy || 0}
                />
              </div>

              {/* get section */}
              <div className="flex items-center space-x-4 mt-4">
                <Label className="font-black text-lg md:text-xl">Get</Label>
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-5/12 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-36"
                  type="text"
                  value={offerDetail.conditions.buyNGetN?.get || 0}
                />
                <p className="font-black">OFF</p>
              </div>

              {/* Add additional input or content for percentage discount if needed */}
            </div>
          )}

          {subCategoryDiscountType === "Rupees" && (
            <div>
              <div className="flex items-center space-x-4">
                <Label className="font-black text-lg md:text-xl">Buy</Label>
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt  w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  // value={offerDetails.conditions.buyNGetN?.buy || 0}
                />
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  // value={offerDetails.conditions.buyNGetN?.buy || 0}
                />
              </div>

              {/* get section */}
              <div className="flex items-center space-x-4 mt-4">
                <Label className="font-black text-lg md:text-xl">Get Rs.</Label>
                <Input
                  readOnly
                  className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-36"
                  type="text"
                  // value={offerDetails.conditions.buyNGetN?.get || 0}
                />
                <p className="font-black">OFF</p>
              </div>
            </div>
          )}
        </>
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
