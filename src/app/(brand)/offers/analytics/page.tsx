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
import OfferAnalytic from "./components/offer-analytic";
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

        <OfferAnalytic offerDetails={offerDetails} />

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
