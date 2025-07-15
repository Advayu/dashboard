"use client";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import Support from "/public/image/contact.svg";
import OfferDetails from "./steps/OfferDetails";
import RedemptionDetails from "./steps/RedemptionDetails";
import TermsConditions from "./steps/TermsConditions";
import CouponPreview from "./steps/CouponPreview";
import StepperLayout from "./components/StepperLayout";
import { StepperProvider, useStepper } from "./contexts/StepperContext";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import CouponDetails from "./steps/couponDetails";
import { useCreateOffer } from "@/hooks/use-offer";
import { useCreateCoupon } from "@/hooks/use-coupon";
import { useSelector } from "react-redux";
import { handleOfferSubmission } from "./utils/offerSubmission";
import { navigateToPreviousPage } from "@/functions/function";
import { RootState } from "@/store/store";
import { useState } from "react";

export default function Page() {
  const methods = useForm({
    mode: "onChange",
    defaultValues: {
      offer_type: "AUTO_APPLY",
      discountType: "PERCENTAGE",
    },
  });

  const watchOfferType = methods.watch("offer_type");
  const showOfferDetailsStep = watchOfferType === "COUPON_CODE";

  const steps = [
    { label: "Offer details", component: () => <OfferDetails /> },
    { label: "Validity & Timing", component: () => <RedemptionDetails /> },
    ...(showOfferDetailsStep
      ? [{ label: "Coupon details", component: () => <CouponDetails /> }]
      : []),
    { label: "Terms and Conditions", component: () => <TermsConditions /> },
    { label: "Preview", component: () => <CouponPreview /> },
  ];

  return (
    <>
      <FormProvider {...methods}>
        <StepperProvider steps={steps}>
          <OfferCreationLayout />
        </StepperProvider>
      </FormProvider>
    </>
  );
}
type SubmitAction = "launch" | "draft" | null;

function OfferCreationLayout() {
  const { activeStep, steps, handleNext } = useStepper();
  const StepComponent = steps[activeStep]?.component;

  const { mutateAsync: createOffer, isLoading: isLoadingOffer } =
    useCreateOffer();
  const { mutateAsync: createCouponAsync, isLoading: isLoadingCoupon } =
    useCreateCoupon();

  const brandId = useSelector((state: RootState) => state.brandUser.brand_id);
  const methods = useFormContext();

  const [submittingAction, setSubmittingAction] = useState<SubmitAction>(null);

  const handleFormSubmit = async (data: any, isDraft: boolean) => {
    setSubmittingAction(isDraft ? "draft" : "launch");

    try {
      await handleOfferSubmission(
        data,
        brandId,
        createOffer,
        createCouponAsync,
        isDraft
      );
    } finally {
      setSubmittingAction(null);
    }
  };

  const handleProceedOrLaunch = () => {
    if (activeStep === steps.length - 1) {
      methods.handleSubmit((data) => handleFormSubmit(data, false))();
    } else {
      methods.handleSubmit(() => handleNext())();
    }
  };

  const isSubmittingDraft = submittingAction === "draft" && isLoadingOffer;
  const isSubmittingLaunch = submittingAction === "launch" && isLoadingOffer;

  return (
    <form
      className="w-full"
      onSubmit={methods.handleSubmit((data) => handleFormSubmit(data, false))}>
      <Navbar />

      <div className="grid grid-cols-1 md:grid-cols-[370px_auto]">
        <StepperLayout />
        <div className="md:px-10 px-4 flex lg:flex-col flex-row md:items-start items-center w-full">
          {StepComponent && <StepComponent />}
        </div>
      </div>

      {/* Button controls */}
      <div className="flex gap-4 px-2 max-w-[1200px] fixed bottom-0 right-0 bg-white py-3 shadow-md">
        {/* Save as Draft */}
        <Button
          type="button"
          variant="outline"
          className="w-40"
          size="thin"
          onClick={methods.handleSubmit((data) => handleFormSubmit(data, true))}
          disabled={isLoadingOffer || isLoadingCoupon}>
          {isSubmittingDraft ? "Saving Draft..." : "Save as Draft"}
        </Button>

        {/* Launch or Proceed */}
        <Button
          type="button"
          onClick={handleProceedOrLaunch}
          className="w-40"
          size="thin"
          disabled={isLoadingOffer || isLoadingCoupon}>
          {activeStep === steps.length - 1
            ? isSubmittingLaunch
              ? "Launching..."
              : "Launch Offer"
            : "Proceed"}
        </Button>
      </div>
    </form>
  );
}

const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between my-10 mx-8 items-center">
        <div className="flex items-center">
          <button
            type="button"
            className="flex  items-center"
            onClick={navigateToPreviousPage}>
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
