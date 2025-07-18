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
import { useDeleteOffer, useUpdateOffer } from "@/hooks/use-offer";
import { generateOfferTitle } from "../../add/generateOfferTitle";
import { offerSchema } from "@/schemas/offer.schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStatusMessage } from "@/hooks/use-status-message";
import { Toast } from "@/components/statusMessage";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/components/ui/confirm-dialog/useConfirm";
import { useRole } from "@/hooks/use-role";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const { isAdmin, isBrandUser } = useRole();

  const { mutate: updateOffer, error, isLoading, isSuccess } = useUpdateOffer();
  const { mutate: deleteOffer } = useDeleteOffer();

  const message = useStatusMessage({ isSuccess, isError: !!error });
  const { confirm } = useConfirm();

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
    setValue,

  } = methods;

  const onSubmit = (data: any) => {

    data.title = generateOfferTitle(data);
    data.is_active = data.status === "Active";
    delete data.discount_type;
    delete data.status;

    updateOffer({ id: offerDetails.id, data });
  };

  // update offer status using switch 
  const handleToogleStatus = async (checked: boolean) => {
    const confirmed = await confirm({
      title: "Toogle offer status ?",
      description: "Are you sure you want to toogle this offer status?",
      confirmText: "Confirm",
      cancelText: "Go Back",
    });

    if (confirmed) {
      const newStatus = checked ? "Active" : "Inactive";

      updateOffer(
        { id: offerDetails.id, data: { is_active: checked } },
        {
          onSuccess: () => {
            // ✅ Update form field status after successful API call
            setValue("status", newStatus);
          },
        }
      );
    }



    return;


  };

  // delete current offer
  const handleDeleteOffer = async () => {

    const confirmed = await confirm({
      title: "Delete offer ?",
      description: "this action cannot be undone",
      confirmText: "Delete",
      cancelText: "Go Back",
      variant: "destructive",
    });

    if (confirmed) {
      deleteOffer(offerDetails.id, {
        onSuccess: () => {

          router.push("/offers");
        },

      });
    }
    return
  };
  return (
    <div className={`flex items-center md:justify-center `}>
      {message && <Toast message={message} duration={5000} />}
      <FormProvider {...methods}>
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <fieldset disabled={isBrandUser}>
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center">
                <Label className="text-xl font-semi-bold">Offer title</Label>{" "}
                {isAdmin &&
                  <Controller

                    name="status"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Switch

                        checked={value === "Active"}
                        onCheckedChange={handleToogleStatus}
                      />
                    )}
                  />
                }
              </div>
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
            <div className="flex items-center mt-4">
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
            {/* <div className="flex items-center">
            <Label className="text-lg font-medium mr-4">Status</Label>
            <select
              {...register("status")}
              className="border border-black rounded-md px-4 py-2 w-48">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div> */}

            {/* Max Redemptions */}
            <div className="my-4">
              <Label>Maximum offer redemption</Label>
              <Input  {...register("total_limit")} type="number" />
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
            {isAdmin &&
              <div className={`flex gap-4 items-center justify-between mt-10 `}>

                <Button
                  variant={"outline"}
                  type="button"
                  onClick={handleDeleteOffer}
                  className="text-red-500">
                  Delete
                </Button>

                <Button disabled={isLoading} type="submit" size={"lg"}>
                  {offerDetails.is_draft ? "Launch Offer" : "Update"}
                  {isLoading ? "..." : ""}
                </Button>
              </div>

            }
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
};

export default UpdateOffer;
