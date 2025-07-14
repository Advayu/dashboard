"use client";
import React from "react";
import { Couponbig } from "@/components/cards/couponCard";
import { useFormContext } from "react-hook-form";
import { generateOfferTitle } from "../generateOfferTitle";

interface CouponPreviewProps {}

const CouponPreview: React.FC<CouponPreviewProps> = ({}) => {
  const { watch } = useFormContext();
  const offerDetail = watch();

  const title = generateOfferTitle(offerDetail);

  return (
    <div className="w-full">
      <div className="mb-4">
        <h1 className="font-bold text-xl md:text-3xl">Preview</h1>
        <p className="text-gray-600 text-base  md:text-2xl">
          View your offer before launching!
        </p>
      </div>
      {/* Coupon Preview Section */}
      <div className="coupon-preview mt-10  bg-white ">
        {/* Coupon Card */}
        <div className="max-w-[30rem]">
          <Couponbig
            totalLimit={offerDetail.totalLimit}
            discountCode={offerDetail.offer_type}
            startDate={offerDetail.startDate}
            endDate={offerDetail.endDate}
            title={title}
          />
        </div>
      </div>

      {/* Action Buttons */}
    </div>
  );
};

export default CouponPreview;
