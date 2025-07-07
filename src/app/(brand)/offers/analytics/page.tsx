"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Minus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Line } from "recharts";
import LineGraph from "@/components/ui/lineGraph";
import { dataset } from "@/components/utils/dataset";
import CouponCard from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import contact from "../../../../../public/image/contact.svg";
import Image from "next/image";
import { ReadOnlyInput } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { useDeleteOffer, useGetOffer, useUpdateOffer } from "@/hooks/use-offer";
import Loading from "@/components/loading";
import User from "@/components/icons/User";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId") || "";
  const { offer: offerDetails, isLoading } = useGetOffer(offerId);
  const { mutate: deleteOffer } = useDeleteOffer();
  const { mutate: updateOffer } = useUpdateOffer();
  console.log("offerDetails>>", offerDetails);

  type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  // Define the mapping of day names to their short form
  const dayMap: Record<Day, string> = {
    Sunday: "S",
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "T",
    Friday: "F",
    Saturday: "S",
  };

  // handle back click to go back to previous page
  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleDeleteOffer = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer? This action cannot be undone."
    );

    if (confirmDelete) {
      deleteOffer(offerId, {
        onSuccess: () => {
          alert("Offer deleted successfully.");
          router.push("/offers"); // redirect to offers list
        },
        onError: () => {
          alert("Failed to delete the offer. Please try again.");
        },
      });
    }
  };

  const handleDisableOffer = () => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable this offer? This action cannot be undone."
    );

    if (confirmDisable) {
      updateOffer({ id: offerId, data: { is_active: false } });
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between my-10 mx-8">
        <button className="flex items-center" onClick={handleBackClick}>
          <ChevronLeft />
          <h1 className="text-3xl font-black ">Offer analytics</h1>
        </button>
        <div className="flex space-x-4 mx-2">
          <button>
            <Image src={contact} alt="contact" />
          </button>
        </div>
      </div>

      {/* start */}

      <section className="flex md:flex-row flex-col space-x-2 px-10">
        <div className="mx-2 pr-[40px] ">
          <ReadOnlyInput
            label="Offer Title"
            id="offerTitle"
            defaultValue={offerDetails.title}
            containerClassName="custom-container-class"
            labelClassName="custom-label-class"
            inputClassName="custom-input-class no-select"
          />
          <div className="md:block flex space-x-4 md:space-x-0 ">
            <div className="flex flex-col md:flex-row my-4 md:space-y-0 space-y-2 md:space-x-4 md:items-center">
              <Label>Discount type</Label>
              <Input
                disabled
                className="border-none font-bold bg-[#F3F3F3] w-40"
                type="text"
                defaultValue={offerDetails.discount_type}
              />
            </div>
          </div>

          <div className="flex my-4 items-center space-x-4">
            <Label>Status of offer</Label>
            <Input
              disabled
              className="border-none font-bold bg-[#F3F3F3]"
              type="text"
              defaultValue={offerDetails.is_active ? "Active" : "Inactive"}
            />
          </div>

          {/* steper  */}

          <div className="flex items-center">
            {/* Vertical Line with Circles */}
            <div className="relative flex flex-col items-center mr-4">
              {/* Line */}
              <div className="h-16 w-0.5 bg-teal-600"></div>
              {/* Circles */}
              <div className="absolute top-0 h-2 w-2 bg-teal-600 rounded-full"></div>
              <div className="absolute top-16 h-2 w-2 bg-teal-600 rounded-full"></div>
            </div>

            {/* Form Section */}
            <div>
              {/* Start Date */}
              <div className="flex items-center mb-6">
                <label className="text-lg font-medium mr-4">Start date</label>

                <Input
                  disabled
                  type="date"
                  defaultValue={
                    offerDetails?.start_date
                      ? offerDetails.start_date.split("T")[0]
                      : ""
                  }
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>

              {/* Expiry Date */}
              <div className="flex items-center">
                <label className="text-lg font-medium mr-4">Expiry date</label>
                <Input
                  disabled
                  type="date"
                  defaultValue={
                    offerDetails?.end_date
                      ? offerDetails.end_date.split("T")[0]
                      : ""
                  }
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>
            </div>
          </div>

          {/* steper */}

          <div className="my-4">
            <Label>Maximum offer redemption</Label>
            <Input
              disabled
              className="border-none font-bold w-full mt-2"
              type="text"
              defaultValue={offerDetails.total_limit}
            />
          </div>

          <ToggleGroup
            type="multiple"
            value={offerDetails.applicable_days || []}
            className="pointer-events-none opacity-50">
            {Object.keys(dayMap).map((day) => (
              <ToggleGroupItem key={day} value={day} className="w-full">
                {dayMap[day as Day]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {/* separator */}
        {/* dotted */}
        <Separator
          className="md:block hidden  border-[#D1D1D1]  border-l-2 border-dashed"
          orientation="vertical"
        />

        <Separator
          orientation="horizontal"
          className="block md:hidden  border-[#D1D1D1]  divide-dashed border-2	 my-4"
        />

        <div className="flex flex-col ml-10">
          <h1 className="text-xl font-bold pl-[40px]">Analytics</h1>
          {/* offer redemption */}
          <div className="flex md:flex-row md:space-y-0 space-y-[24.5px] flex-col space-x-10 my-8 md:items-center">
            <div className=" mx-10">
              <p>Offer redemption</p>
              <div className="flex items-center text-center">
                <User />
                <p className="text-3xl mx-2">
                  {offerDetails.total_redemption}{" "}
                </p>
                <span className="text-[#2AA000] font-bold">( 0 %)</span>
              </div>
            </div>
            <div className="md:space-y-0 space-y-[5px]">
              <p>offer ranking</p>
              <p className=" text-3xl font-bold">
                #233 <span className="text-base font-normal	 "> /9.232+ </span>
              </p>
            </div>
          </div>

          <div></div>
          <div className="flex justify-between mx-10">
            <CouponCard
              id={offerDetails.id}
              title={offerDetails.title}
              start_date={
                offerDetails?.start_date
                  ? offerDetails.start_date.split("T")[0]
                  : ""
              }
              expiry_date={
                offerDetails?.end_date
                  ? offerDetails.end_date.split("T")[0]
                  : ""
              }
              unique_code={offerDetails.offer_type}
              total_coupons={offerDetails.total_limit}
              number_of_redemptions={0}
            />

            {/* <Image src={qrcode} alt="qr code" /> */}
          </div>
          <div className="flex justify-end pr-[40px] my-8 space-x-2">
            <Button
              onClick={handleDeleteOffer}
              className="px-4 bg-red-500 text-white"
              size={"thin"}
              variant={"outline"}>
              Delete
            </Button>

            <Button
              onClick={handleDisableOffer}
              className="bg-yellow-500 text-white px-4"
              size={"thin"}
              variant={"outline"}>
              Disable
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
