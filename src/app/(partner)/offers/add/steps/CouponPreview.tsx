"use client";
import React, { use, useEffect, useState } from "react";
import CouponCard, { Couponbig } from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { off } from "process";
import axios from "axios";
import { saveOfferAsDraft } from "@/services/api/offers/offersApi";
import { generateUniqueUUID } from "@/functions/function";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { resetOfferDetails } from "@/store/offerSlice/offerDetailsSlice";
import { LAMBDA_URL } from "@/utils/constants";
import dayjs from "dayjs";

interface CouponPreviewProps {
  handleNext: () => void;
  activeStep: number;
}

const CouponPreview: React.FC<CouponPreviewProps> = ({
  handleNext,
  activeStep,
}) => {
  const [loadingState, setLoadingState] = useState({
    saveDraft: false,
    processed: false,
  });
  const offerDetail = useSelector((state: any) => state.offerDetails);
  const brandDetails = useSelector((state: RootState) => state.brand);
  const dispatch = useDispatch(); // Correctly initialize dispatch
  const { toast } = useToast();
  const router = useRouter();
  const handleLaunchOffer = async () => {
    console.log("Offer detail for launch:", offerDetail);
    setLoadingState({ ...loadingState, processed: true });

    // const outletId =
    //   localStorage.getItem("selectedOutletId") || offerDetail.outletId;
    const outletId = offerDetail.outletId;
    console.log("outletId", outletId);
    console.log("offerdetails>>", offerDetail);
    //Todo: get brand outlet id and brand id from the redux
    const data = {
      id: generateUniqueUUID(),
      brand_id: brandDetails.id,
      title: offerDetail.title,
      outlet_id: outletId,
      code: offerDetail.discountCode,
      discount_type: offerDetail.discountType,
      discount_value: Number(offerDetail.discountValue.replace("%", "")),
      min_order_value: Number(offerDetail.minOrderValue),
      max_discount_value: Number(offerDetail.maxDiscountValue),
      applicable_days: offerDetail.applicableDays,
      terms_conditions: "",
      start_date: offerDetail.startDate,
      end_date: offerDetail.endDate,
      total_limit: Number(offerDetail.totalLimit),
      is_active: true,
    };

    console.log("data", data);

    try {
      const response = await axios.post(`${LAMBDA_URL}/offers`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 201) {
        setLoadingState({ ...loadingState, processed: false });
        toast({
          duration: 5000,
          variant: "success",
          title: "Offer launched successfully",
        });

        // Reset offer details in the Redux state
        dispatch(resetOfferDetails());

        // Redirect to the offers page
        router.push("/offers");
      }

      console.log("Response:", response.data);
    } catch (error: any) {
      setLoadingState({ ...loadingState, processed: false });
      toast({
        variant: "destructive",
        title: "Failed to launch offer. Please try again.",
        duration: 5000,
      });
      console.error("Error:", error.response?.data || error.message);
    }
  };

  const handleDraft = async () => {
    // const brandId = localStorage.getItem("brandId") || offerDetail.brandId;
    const brandId = brandDetails.id;
    setLoadingState({ ...loadingState, saveDraft: true });
    try {
      const responseCode: any = await saveOfferAsDraft(
        offerDetail, // Pass the updated details
        offerDetail.outletId,
        brandId
      );

      if (responseCode == 201) {
        toast({
          duration: 5000,
          variant: "success",
          title: "Offer saved as draft",
        });
        setLoadingState({ ...loadingState, saveDraft: false });
        dispatch(resetOfferDetails());
        router.push("/offers");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        console.log("Unauthorized: Redirecting to login...");
        router.push("/auth");
      }
      console.error("Error saving draft:", error);
      setLoadingState({ ...loadingState, saveDraft: false });
      toast({
        duration: 5000,
        variant: "destructive",
        title: "Failed to save offer as draft. Please try again.",
      });
    }
  };

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
          {/* <CouponCard
            id={1}
            title="Get 20% off on all items"
            number_of_redemptions={0}
            total_coupons={offerDetail.totalLimit}
            expiry_date= {offerDetail.endDate.split("T")[0]}
            start_date= {offerDetail.startDate.split("T")[0]}
            unique_code= {offerDetail.discountCode}
          /> */}

          <Couponbig
            totalLimit={offerDetail.totalLimit}
            discountCode={offerDetail.discountCode}
            startDate={offerDetail.startDate}
            endDate={offerDetail.endDate}
            title={offerDetail.title}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end mt-6">
        <Button
          disabled={loadingState.saveDraft}
          onClick={handleDraft}
          variant="outline"
          className="w-32 md:w-40"
          size="thin">
          {loadingState.saveDraft ? "Saving..." : "Save as draft"}
        </Button>
        <Button
          disabled={loadingState.processed}
          className="w-32 md:w-40"
          size="thin"
          onClick={handleLaunchOffer}>
          {loadingState.processed ? "Launching..." : "Launch offer"}
        </Button>
      </div>
    </div>
  );
};

export default CouponPreview;
function dispatch(arg0: {
  payload: undefined;
  type: "offerDetails/resetOfferDetails";
}) {
  throw new Error("Function not implemented.");
}
