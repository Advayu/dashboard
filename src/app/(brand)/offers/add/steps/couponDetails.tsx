import { DynamicInputList } from "@/components/DynamicInputList";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

const CouponDetails = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const offerType = watch("offer_type");
  const couponType = watch("coupon_type");
  return (
    <div>
      <div className="flex flex-col ">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl	font-black">Offer details</h1>
          <p>Curate your Coupon</p>
        </div>

        {/* form to start creating Coupon */}

        <div>
          {offerType === "COUPON_CODE" && (
            <div>
              <h1>Coupon type</h1>
              <Controller
                control={control}
                name="coupon_type"
                render={({ field }) => (
                  <div>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
                        <SelectValue placeholder="Coupon type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed_code">Fixed code</SelectItem>
                        <SelectItem value="unique_code">Unique code</SelectItem>
                        {/* Add more options if needed */}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              />
            </div>
          )}
        </div>

        {couponType === "fixed_code" && (
          <div>
            <DynamicInputList
              className="w-72"
              fieldName={`coupon_code`}
              label="Enter coupon code"
              placeholder="enter coupon code"
              index={2}
            />
          </div>
        )}

        {couponType === "unique_code" && (
          <div>
            <label htmlFor="no_of_coupons">No. of coupons</label>
            <Input
              type="number"
              placeholder="Enter number of coupons"
              {...register("no_of_coupons")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponDetails;
