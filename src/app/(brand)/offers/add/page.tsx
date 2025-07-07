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
import { useCreateCoupon } from "@/hooks/use-coupon";
import { useSelector } from "react-redux";
import { handleOfferSubmission } from "./utils/offerSubmission";

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
    defaultValues: {},
  });

  const onSubmit = async (data: any) => {
    handleOfferSubmission(data, brandId, createOffer, createCouponAsync);
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
            size={"thin"}>
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
              size={"thin"}>
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
