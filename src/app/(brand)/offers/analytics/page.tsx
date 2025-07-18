"use client";
import { ChevronLeft, Minus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeleteOffer, useGetOffer, useUpdateOffer } from "@/hooks/use-offer";
import Loading from "@/components/loading";
import User from "@/components/icons/User";
import { useGetCouponsByOfferId } from "@/hooks/use-coupon";

import CouponTable from "@/components/CouponTable";
import UpdateOffer from "./components/offer-update";
import OfferAnalytic from "./components/offer-analytic";
import { motion } from "motion/react";

const Page = () => {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId") || "";
  const { offer: offerDetails, isLoading } = useGetOffer(offerId);

  const { data: coupons } = useGetCouponsByOfferId(offerId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Header />

      {/* start */}

      <section className="flex flex-col md:flex-row gap-6 px-10">
        <div className="w-full md:w-[33%]">
          <UpdateOffer offerDetails={offerDetails} />
        </div>

        <Separator
          className="hidden md:block border-l-2 border-dashed border-gray-300"
          orientation="vertical"
        />
        <Separator
          className="block md:hidden border-t-2 border-dashed border-gray-300 my-4"
          orientation="horizontal"
        />

        <div className="w-full md:w-[33%]">
          <OfferAnalytic offerDetails={offerDetails} />
        </div>

        {offerDetails?.offer_type === "COUPON_CODE" && (
          <>
            <Separator
              className="hidden md:block border-l-2 border-dashed border-gray-300"
              orientation="vertical"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full md:w-[33%] rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 shadow-sm">
              <CouponTable coupons={coupons} />
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
};

const Header = () => {
  const router = useRouter();
  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="flex justify-between my-10 mx-8">
      <button
        className="flex items-center hover:pointer"
        onClick={handleBackClick}>
        <ChevronLeft />
        <h2 className="text-xl font-semibold">Offer details</h2>
      </button>
    </div>
  );
};

export default Page;
