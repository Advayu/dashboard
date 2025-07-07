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
import { useGetCoupons, useGetCouponsByOfferId } from "@/hooks/use-coupon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CouponTable from "@/components/CouponTable";
import UpdateOffer from "./components/offer-update";
const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId") || "";
  const { offer: offerDetails, isLoading } = useGetOffer(offerId);
  const { mutate: deleteOffer } = useDeleteOffer();
  const { mutate: updateOffer } = useUpdateOffer();
  console.log("offerDetails", offerDetails);
  const { data: coupons } = useGetCouponsByOfferId(offerId);

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
          <UpdateOffer offerDetails={offerDetails} />

          {/* steper */}
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

        <Separator
          className="md:block hidden  border-[#D1D1D1]  border-l-2 border-dashed"
          orientation="vertical"
        />
        {/* coupons section  */}
        <div className="">
          <CouponTable coupons={coupons} />
        </div>
      </section>
    </div>
  );
};

export default Page;
