import React, { use, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import OfferDetailsShow from "../OfferDetailsShow";
import OfferDetails from "./OfferDetails";
import { saveOfferAsDraft } from "@/services/api/offers/offersApi";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { resetOfferDetails } from "@/store/offerSlice/offerDetailsSlice";
import axios from "axios";
interface TermsConditionsProps {
  // Define your props here
  handleNext: () => void;
  activeStep: number;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({
  handleNext,
  activeStep,
}) => {
  // Add your component logic here
  const offerDetail = useSelector((state: RootState) => state.offerDetails);
  const brandUser = useSelector((state: RootState) => state.brandUser);
  const dispatch = useDispatch();
  const [loadingState, setLoadingState] = useState({
    saveDraft: false,
    processed: false,
  });
  const router = useRouter();

  const { toast } = useToast();
  useEffect(() => {
    console.log("brand details", brandUser);
  }, []);

  // const brandName = brandUser?.name || localStorage.getItem("brandName");
  const brandName = brandUser?.name;
  const termsAndConditions = [
    { id: 1, text: `Offer is valid at <b>${brandName}</b>'s outlets` },
    // { id: 2, text: "Coupon code can be applied only once in n hours" },
    { id: 3, text: `Offer valid on <b>${offerDetail.applicableDays}</b>` },
    {
      id: 4,
      text: `Offer valid till <b>${offerDetail.endDate.split("T")[0]}</b>`,
    },
    // { id: 5, text: "Offer is applicable on Enter items" },
    {
      id: 6,
      text: `Discount can only be availed when paying your bill at <b>${brandUser?.name}</b>`,
    },
    // {
    //   id: 7,
    //   text: "Coupon redemption details will be sent via message, email, or on the Advayu app",
    // },
    {
      id: 8,
      text: "Once redeemed, the offer cannot be modified or transferred",
    },
    { id: 9, text: "The offer is guaranteed" },
    {
      id: 10,
      text: "<b>Advayu</b> shall not be responsible for any loss you may incur",
    },
  ];

  const handleDraft = async () => {
    // const brandId = localStorage.getItem("brandId") || offerDetail.brandId;
    const brandId = brandUser.brand_id;
    const outletId = offerDetail.outletId;
    setLoadingState({ ...loadingState, saveDraft: true });
    try {
      const responseCode: any = await saveOfferAsDraft(
        offerDetail, // Pass the updated details
        outletId,
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
    <div className="p-4 bg-white rounded">
      {/* Header Section */}
      <div className="mb-4">
        <h1 className="font-bold text-2xl md:text-3xl">Terms and Conditions</h1>
        <p className="text-gray-600 text-sm">Set offer conditions</p>
      </div>

      {/* Offer Conditions Section */}
      <OfferDetailsShow />

      {/* Terms and Conditions List */}
      <ul className="list-disc pl-6 mt-6 text-gray-800">
        {termsAndConditions.map((term) => (
          <li
            key={term.id}
            className="text-sm md:text-base py-2"
            dangerouslySetInnerHTML={{ __html: term.text || "" }}
          />
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          disabled={loadingState.saveDraft}
          onClick={handleDraft}
          variant="outline"
          className="w-32 md:w-40"
          size="thin">
          {loadingState.saveDraft ? "Saving..." : "Save for later"}
        </Button>
        <Button className="w-32 md:w-40" size="thin" onClick={handleNext}>
          {loadingState.processed ? "Processing..." : "processed"}
        </Button>
      </div>
    </div>
  );
};

export default TermsConditions;
