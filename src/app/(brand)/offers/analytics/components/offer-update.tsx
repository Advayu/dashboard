import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import React from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUpdateOffer } from "@/hooks/use-offer";
import { generateOfferTitle } from "../../add/generateOfferTitle";
import { offerSchema } from "@/schemas/offer.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStatusMessage } from "@/hooks/use-status-message";
import { Toast } from "@/components/statusMessage";

type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const dayMap: Record<Day, string> = {
  Sunday: "S",
  Monday: "M",
  Tuesday: "T",
  Wednesday: "W",
  Thursday: "T",
  Friday: "F",
  Saturday: "S",
};
type OfferFormData = z.infer<typeof offerSchema>;

const UpdateOffer = ({ offerDetails }: any) => {
  const { mutate: updateOffer, error, isLoading, isSuccess } = useUpdateOffer();

  const methods = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      ...offerDetails,
      status: offerDetails?.is_active ? "Active" : "Inactive",
      start_date: offerDetails?.start_date?.split("T")[0] || "",
      end_date: offerDetails?.end_date?.split("T")[0] || "",
      applicable_days: offerDetails?.applicable_days || [],
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const onSubmit = (data: any) => {
    console.log("data", data);
    data.title = generateOfferTitle(data);
    data.is_active = data.status === "Active";
    delete data.discount_type;
    delete data.status;

    updateOffer({ id: offerDetails.id, data });
  };

  return (
    <div className={`flex items-center md:justify-center `}>
      <FormProvider {...methods}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2 mb-6">
            <Label className="text-xl font-semi-bold">Offer title</Label>
            <Input
              disabled
              {...register("title")}
              className="font-medium text-xl border-gray-300 bg-gray-300/30"
            />
          </div>

          {/* Discount Type */}
          <div className="flex flex-col md:flex-row my-4 md:space-y-0 space-y-2 md:space-x-4 md:items-center">
            <Label>Discount type</Label>
            <Input
              disabled
              className="border-none font-bold bg-gray-400/40 w-40"
              type="text"
              {...register("discount_type")}
            />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {/* PERCENTAGE Discount Accordion */}
            {watch("discount_type") === "PERCENTAGE" && (
              <AccordionItem value="percentage">
                <AccordionTrigger className="text-lg font-semibold">
                  Percentage Discount Options
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-blueTilt rounded-md p-4 space-y-4">
                    <div>
                      <Label>Discount Percentage</Label>
                      <Input
                        {...register("discount_percent", {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="Discount percentage"
                      />
                    </div>
                    <div>
                      <Label>Minimum Order Value</Label>
                      <Input
                        {...register("min_order_value", {
                          valueAsNumber: true,
                        })}
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Maximum Discount Cap</Label>
                      <Input
                        {...register("discount_value", { valueAsNumber: true })}
                        type="number"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* ABSOLUTE Discount Accordion */}
            {watch("discount_type") === "ABSOLUTE" && (
              <AccordionItem value="absolute">
                <AccordionTrigger className="text-lg font-semibold">
                  Absolute Discount Options
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border border-blueTilt rounded-md p-4 space-y-4">
                    <div>
                      <Label>Discount Value</Label>
                      <Input
                        {...register("discount_value", { valueAsNumber: true })}
                        type="number"
                      />
                    </div>
                    <div>
                      <Label>Minimum Order Value</Label>
                      <Input
                        {...register("min_order_value", {
                          valueAsNumber: true,
                        })}
                        type="number"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {/* Date Picker Row */}
          <div className="flex items-center">
            {/* Vertical Line and Circles */}
            <div className="relative flex flex-col items-center mr-4">
              <div className="h-16 w-0.5 bg-teal-600"></div>
              <div className="absolute top-0 h-2 w-2 bg-teal-600 rounded-full"></div>
              <div className="absolute top-16 h-2 w-2 bg-teal-600 rounded-full"></div>
            </div>

            {/* Start & End Date */}
            <div>
              <div className="flex items-center mb-6">
                <label className="text-lg font-medium mr-4">Start date</label>
                <Input
                  type="date"
                  {...register("start_date")}
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>

              <div className="flex items-center">
                <label className="text-lg font-medium mr-4">Expiry date</label>
                <Input
                  type="date"
                  {...register("end_date")}
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center">
            <Label className="text-lg font-medium mr-4">Status</Label>
            <select
              {...register("status")}
              className="border border-black rounded-md px-4 py-2 w-48">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Max Redemptions */}
          <div className="my-4">
            <Label>Maximum offer redemption</Label>
            <Input {...register("total_limit")} type="number" />
          </div>

          {/* Toggle Group for Applicable Days */}
          <div>
            <Label className="mb-2 block">Applicable Days</Label>
            <Controller
              control={control}
              name="applicable_days"
              render={({ field }) => (
                <ToggleGroup
                  type="multiple"
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-2">
                  {Object.keys(dayMap).map((day) => (
                    <ToggleGroupItem key={day} value={day} className="w-8">
                      {dayMap[day as Day]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              )}
            />
          </div>

          <div className="">
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateOffer;
