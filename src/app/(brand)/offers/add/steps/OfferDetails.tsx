//offerDetails.tsx
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

import { Controller, useFormContext } from "react-hook-form";
import {
  ComboOffers,
  FlatOff,
  FreeGift,
  ItemsAtSetPrice,
  PercentageOff,
  BuyNGetN,
} from "../components";
import { useSelector } from "react-redux";
import { useGetOutlets } from "@/hooks/use-outlet";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { InfoTooltip } from "@/components/ui/info-tooltip";
interface OfferDetailsProps {}

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

const OfferDetails: React.FC<OfferDetailsProps> = () => {
  const brandId = useSelector((state: any) => state.brandUser.brand_id);
  const { data: outlets } = useGetOutlets(brandId);
  const outletOptions = (outlets ?? []).map((outlet: any) => ({
    label: outlet.name,
    value: outlet.id,
  }));
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const discountType = watch("discountType") || "PERCENTAGE";

  const renderOfferDetailsComponent = () => {
    switch (discountType) {
      case "ABSOLUTE":
        return <FlatOff />;
      case "PERCENTAGE":
        return <PercentageOff />;
      // case "Buy n Get n":
      //   return <BuyNGetN />;
      // case "Free gift":
      //   return <FreeGift />;
      // case "Items at set price":
      //   return <ItemsAtSetPrice />;
      // case "Combo offers":
      //   return <ComboOffers />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl	font-black">Offer details</h1>
        <p className="text-sm text-muted-foreground mb-2">Curate your offer</p>
      </div>

      {/* form to start creating offer */}
      <div>
        <h1 className="text-xl font-bold mt-6">
          Select Your Outlet <span className="text-red-500">*</span>
        </h1>
        <Controller
          control={control}
          name="outletIds"
          render={({ field }) => (
            <MultiSelect
              options={outletOptions}
              selected={field.value ?? []}
              onChange={field.onChange}
              placeholder="Select outlets"
              className="w-48"
            />
          )}
        />
      </div>
      {/* {errors.outletIds && (
        <p className="text-sm text-red-500 mt-1">
          {errors?.outletIds?.message}
        </p>
      )} */}

      <div className="space-y-2">
        <h1 className="text-xl font-bold mt-6">Offer type</h1>

        <Controller
          control={control}
          name="offer_type"
          rules={{ required: "Offer type is required" }}
          defaultValue="AUTO_APPLY"
          render={({ field }) => (
            <RadioGroup
              className="flex flex-row items-center gap-4"
              value={field.value}
              onValueChange={field.onChange}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="AUTO_APPLY" id="AUTO_APPLY" />
                <Label htmlFor="AUTO_APPLY">Auto Apply</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COUPON_CODE" id="COUPON_CODE" />
                <Label htmlFor="COUPON_CODE">Coupon Code</Label>
              </div>
            </RadioGroup>
          )}
        />
      </div>

      <div>
        <h1 className="text-xl font-bold mt-6">
          Discount type <span className="text-red-500">*</span>
        </h1>

        <Controller
          control={control}
          name="discountType"
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue="PERCENTAGE"
              value={field.value}>
              <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
                <SelectValue placeholder="discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABSOLUTE">Flat off</SelectItem>
                <SelectItem value="PERCENTAGE">Percentage off</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {renderOfferDetailsComponent()}
      <div className="mt-4">
        <Label className="flex items-center text-xl font-bold">
          Maximum offer redemptions
          <InfoTooltip message="Maximum number of redemptions allowed" />
        </Label>
        <Input
          type="text"
          placeholder="Enter maximum number"
          className="w-52 mt-[7.5px]"
          {...register("total_limit")}
        />
      </div>

      <div className="mt-4">
        <Label className="flex items-center text-xl font-bold">
          Maximum limit per user
          <InfoTooltip message="Maximum number of redemptions allowed" />
        </Label>
        <Input
          type="text"
          placeholder="max per user"
          className="w-52 mt-[7.5px]"
          {...register("max_per_user")}
        />
      </div>
    </div>
  );
};

export default OfferDetails;
