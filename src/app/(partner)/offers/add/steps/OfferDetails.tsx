import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useForm, Controller } from "react-hook-form";
import {
  ComboOffers,
  FlatOff,
  FreeGift,
  ItemsAtSetPrice,
  PercentageOff,
  BuyNGetN,
} from "../components";
interface OfferDetailsProps {
  // Define your component props here
  handleNext: () => void;
  activeStep: number;
}

interface OfferDetails {
  offerType: string; // e.g., "Flat off", "Percentage off", etc.
  offerCode: string; // Unique offer code
  conditions: {
    flatOff?: {
      flatOff: number; // Flat discount amount
      abovePurchase: number; // Minimum purchase required
    };
    percentageOff?: {
      percentage: number; // Discount percentage
      price: number;
      abovePurchase: number; // Minimum purchase required
      uptoDiscount: number; // Maximum discount amount
    };
    buyNGetN?: {
      buy: number; // Items to buy
      get: number; // Items to get for free or discounted
      description: string; // Description of the offer
    };
    freeGift?: {
      description: string; // Gift description
      minPurchase: number; // Minimum purchase required
    };
    itemsAtSetPrice?: {
      get: string; // Description of items
      value: number; // Fixed price
    };
    comboOffer?: {
      comboDetails: string; // Description of combo
    };
  };
}

const OfferDetails: React.FC<OfferDetailsProps> = ({
  handleNext,
  activeStep,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      outletId: "",
      discountType: "",
      discountCode: "",
    },
  });

  const discountType = watch("discountType");

  const onSubmit = (data) => console.log(data);

  const renderOfferDetailsComponent = () => {
    switch (discountType) {
      case "Flat off":
        return <FlatOff />;
      case "Percentage off":
        return <PercentageOff />;
      case "Buy n Get n":
        return <BuyNGetN />;
      case "Free gift":
        return <FreeGift />;
      case "Items at set price":
        return <ItemsAtSetPrice />;
      case "Combo offers":
        return <ComboOffers />;
      default:
        return <div>No component found</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl	font-black">Offer details</h1>
        <p>Curate your offer</p>
      </div>

      {/* form to start creating offer */}

      <h1 className="text-xl font-bold mt-6">
        Select Your Outlet <span className="text-red-500">*</span>
      </h1>
      <Controller
        control={control}
        name="outletId"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
              <SelectValue placeholder="Select outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new outlet">New outlet</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      <h1 className="text-xl font-bold mt-6">
        Category of your offer <span className="text-red-500">*</span>
      </h1>

      <Controller
        control={control}
        name="discountType"
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
              <SelectValue placeholder="Offer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flat off">Flat off</SelectItem>
              <SelectItem value="Percentage off">Percentage off</SelectItem>
              <SelectItem value="Buy n Get n">Buy n Get n</SelectItem>
              <SelectItem value="Free gift">Free gift</SelectItem>
              <SelectItem value="Items at set price">
                Items at set price
              </SelectItem>
              <SelectItem value="Combo offers">Combo offers</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      {/* select your outlet */}

      {renderOfferDetailsComponent()}

      {/* Enter offer code */}
      <div className="my-4 space-y-2 mt-8">
        <Label className=" md:text-xl text-sm">
          Offer Code: <span className="text-red-500">*</span>
        </Label>
        <Input
          className="border border-black px-3 py-2 rounded-md text-base md:text-lg focus:outline-none focus:ring focus:ring-blue-500  w-48"
          placeholder="Enter offer code"
          {...register("discountCode", { required: "Offer code is required" })}
        />
        {errors.discountCode && (
          <p className="text-red-500 text-sm">{errors.discountCode.message}</p>
        )}
      </div>
      <div className="flex space-x-2 md:justify-end ">
        <Button
          type="button"
          variant={"outline"}
          className="my-5 w-40 "
          size={"thin"}>
          Save draft
        </Button>
        <Button type="submit" className="my-5 w-40" size={"thin"}>
          Procced
        </Button>
      </div>
    </form>
  );
};

export default OfferDetails;
