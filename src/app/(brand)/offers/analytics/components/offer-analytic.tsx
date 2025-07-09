import CouponCard from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import React from "react";
import {
  useDeleteOffer,
  useGetOfferAnalytics,
  useUpdateOffer,
} from "@/hooks/use-offer";

const OfferAnalytic = ({ offerDetails }: any) => {
  const { mutate: deleteOffer } = useDeleteOffer();
  const { mutate: updateOffer } = useUpdateOffer();
  const { data: analytics } = useGetOfferAnalytics(
    offerDetails?.id,
    offerDetails.start_date,
    offerDetails.end_date,
    !!offerDetails?.id
  );
  const ranking = analytics?.ranking;

  const handleDeleteOffer = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this offer? This action cannot be undone."
    );

    if (confirmDelete) {
      deleteOffer(offerDetails.id, {
        onSuccess: () => {
          alert("Offer deleted successfully.");
          window.location.href = "/offers";
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
      updateOffer({ id: offerDetails.id, data: { is_active: false } });
    }
  };

  return (
    <div className="flex flex-col  ">
      <h1 className="text-xl font-bold ">Analytics</h1>
      {/* offer redemption */}
      <div className="flex md:flex-row  flex-col gap-10 my-8 md:items-center">
        <div className=" ">
          <p className="text-lg font-semibold">Offer redemption</p>
          <div className="flex items-center flex-row">
            <User />
            <p className="text-3xl md:mx-2">{offerDetails.total_redemption} </p>
            <span className="text-[#2AA000] font-bold">
              ( {analytics?.redemptions}%)
            </span>
          </div>
        </div>
        <div className="">
          <p className="text-lg font-semibold">Offer ranking</p>
          <p className="flex items-center flex-row text-3xl font-medium">
            {ranking?.rank}/
            <span className="text-base font-normal"> {ranking?.total} </span>
          </p>
        </div>
      </div>

      <div className="flex justify-center ">
        <CouponCard
          id={offerDetails.id}
          title={offerDetails.title}
          start_date={
            offerDetails?.start_date
              ? offerDetails.start_date.split("T")[0]
              : ""
          }
          expiry_date={
            offerDetails?.end_date ? offerDetails.end_date.split("T")[0] : ""
          }
          unique_code={offerDetails.offer_type}
          total_coupons={offerDetails.total_limit}
          number_of_redemptions={0}
        />

        {/* <Image src={qrcode} alt="qr code" /> */}
      </div>
      <div className="flex justify-center md:pr-[40px] my-8 space-x-2">
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
  );
};

export default OfferAnalytic;
