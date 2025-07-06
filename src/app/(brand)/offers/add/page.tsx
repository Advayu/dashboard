"use client";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Support from "/public/image/contact.svg";
import OfferDetails from "./steps/OfferDetails";
import RedemptionDetails from "./steps/RedemptionDetails";
import TermsConditions from "./steps/TermsConditions";
import CouponPreview from "./steps/CouponPreview";
import StepperLayout from "./newComp/StepperLayout";
import { StepperProvider, useStepper } from "./contexts/StepperContext";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CouponDetails from "./steps/couponDetails";
import { useCreateOffer } from "@/hooks/use-offer";
import { get } from "http";
import { generateOfferTitle } from "./generateOfferTitle";
import { create } from "domain";
import { useCreateCoupon } from "@/hooks/use-coupon";
import { useSelector } from "react-redux";
import { off } from "process";
import { min } from "date-fns";

export default function Page() {
  const steps = [
    { label: "Offer details", component: () => <OfferDetails /> },
    { label: "Validity & Timing", component: () => <RedemptionDetails /> },
    { label: "Coupon details", component: () => <CouponDetails /> },
    { label: "Terms and Conditions", component: () => <TermsConditions /> },
    { label: "Preview", component: () => <CouponPreview /> },
  ];

  return (
    <>
      <StepperProvider steps={steps}>
        <OfferCreationLayout />
      </StepperProvider>
    </>
  );
}

function OfferCreationLayout() {
  const { activeStep, steps, handleNext } = useStepper();
  const StepComponent = steps[activeStep]?.component;
  const { mutateAsync: createOffer } = useCreateOffer();
  const { mutateAsync: createCouponAsync } = useCreateCoupon();
  const brandId = useSelector((state: any) => state.brandUser.brand_id);

  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      // you can set default form values or load from localStorage here
    },
  });

  const onSubmit = async (data: any) => {
    for (const outlet_id of data.outletIds) {
      const offer_payload: any = {
        brand_id: brandId,
        offer_type: data.offer_type,
        discount_type: data.discountType,
        start_date: data.startDate + "T23:59:59.000Z",
        end_date: data.endDate + "T23:59:59.000Z",
        applicable_days: data.applicableDays,
        max_per_user: Number(data.max_per_user),
        total_limit: Number(data.total_limit),
        min_order_value: Number(data.min_order_value),
        terms_conditions: "terms and conditions", // change later
        title: generateOfferTitle(data),
        outlet_id: outlet_id,
        is_active: true,
      };

      if (offer_payload.discount_type === "PERCENTAGE") {
        offer_payload["discount_percent"] = Number(data.discount_percent);
        offer_payload["discount_value"] = Number(data.max_discount_value);
        offer_payload["max_discount_value"] = Number(data.max_discount_value);
      } else {
        offer_payload["discount_value"] = Number(data.discount_value);
      }

      try {
        // Step 1: Create the offer
        const offerResponse = await createOffer(offer_payload);

        const offer_id = offerResponse?.id;
        if (!offer_id) {
          console.warn("Failed to create offer for outlet:", outlet_id);
          continue;
        }

        // Step 2: Create coupons only if offer type is COUPON_CODE
        if (offerResponse.offer_type === "COUPON_CODE") {
          var coupon_payload: any = {
            offer_id: offer_id,
            expires_at: data.endDate + "T23:59:59.000Z",
          };
          if (data.coupon_type === "fixed_code") {
            coupon_payload["code"] = data.coupon_code;
            const couponResponse = await createCouponAsync(coupon_payload);
            console.log("Coupon created:", couponResponse);
          } else {
            for (let i = 0; i < data.no_of_coupons; i++) {
              coupon_payload["code"] =
                `COUPON-${Math.random().toString(36).substring(2, 15)}`;
              const couponResponse = await createCouponAsync(coupon_payload);
              console.log("Coupon created:", couponResponse);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to process outlet ${outlet_id}:`, error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form className="w-full" onSubmit={methods.handleSubmit(onSubmit)}>
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-[370px_auto]">
          <StepperLayout />
          {StepComponent ? <StepComponent /> : null}
        </div>
        {/* Example navigation buttons */}
        <div className="flex space-x-2 md:justify-end ">
          <Button
            type="button"
            variant={"outline"}
            className="my-5 w-40 "
            size={"thin"}
          >
            Save draft
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button type="submit" className="my-5 w-40" size={"thin"}>
              Launch Offer
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="my-5 w-40"
              size={"thin"}
            >
              Procced
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between my-10 mx-8 items-center">
        <div className="flex items-center">
          <button className="flex  items-center">
            <ChevronLeft />
            <h1 className="md:text-3xl	font-black"> New offer</h1>
          </button>
        </div>
        <div className=" md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
          <h3 className="md:text-xl text-xs">support@advayu.club</h3>
          <h3 className="md:text-xl text-xs">+91 9660657811</h3>
        </div>
        <Image className="md:hidden block" src={Support} alt="support" />
      </div>
    </div>
  );
};
