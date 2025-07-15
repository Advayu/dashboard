"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { daysOfWeek } from "@/app/Constants/constant";
import OfferDetailsShow from "../OfferDetailsShow";
import { Controller, useFormContext } from "react-hook-form";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import WeekdaySelector from "@/components/WeekdaySelector";

interface RedemptionDetailsProps {}

// Reusable Tooltip Component

// Reusable Button Component for Days
const currentDate = dayjs(); // Get the current date
dayjs.extend(utc);
dayjs.extend(timezone);
const RedemptionDetails: React.FC<RedemptionDetailsProps> = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // Function to toggle the selection of a day
  const toggleDaySelection = (
    selectedDays: string[],
    value: string
  ): string[] => {
    return selectedDays.includes(value)
      ? selectedDays.filter((day) => day !== value)
      : [...selectedDays, value];
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="">
        <header>
          <h1 className="font-bold text-3xl text-2xl">Validity details</h1>
          <p className="text-2xl mt-2 text-xl">Set validity and timing</p>
        </header>

        {/* Date Range */}
        <div className="mt-10">
          <h2 className="text-lg font-medium mb-4 blue-tilt">
            {/* Todo: replace with actual discount type */}
            {/* {offerDetail.discountType} */}
          </h2>
          {/* <OfferDetailsShow {...offerDetails} /> */}
          <div className="flex space-x-4 mt-[24.4px]">
            <div className="flex md:flex-row flex-col md:gap-0 gap-2   items-center">
              <div className="flex flex-col gap-2">
                <label className="text-xl font-bold flex items-center gap-1">
                  Start date
                  <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <input
                    {...register("startDate", {
                      required: {
                        value: true,
                        message: "Please enter start date ",
                      },
                    })}
                    type="date"
                    className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase border border-black"
                    required
                    min={dayjs().format("YYYY-MM-DD")}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs">
                      {errors?.startDate?.message?.toString()}
                    </p>
                  )}
                </div>
              </div>

              <div className=" md:block hidden h-[1.5px] w-12 bg-black  mt-[2rem]" />

              <div className="flex flex-col gap-2">
                <label className="text-xl font-bold">Expiry date</label>
                <div className="relative">
                  <input
                    {...register("endDate", {
                      required: {
                        value: true,
                        message: "Please enter expiry date",
                      },
                    })}
                    type="date"
                    className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase border border-black"
                    required
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs">
                      {errors?.endDate?.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Select Days */}
        <div className="mt-6">
          <h2 className="text-xl font-bold flex items-center">
            Select days it will run
            <span className="text-red-500">*</span>
            <InfoTooltip message="Select days to run" />
          </h2>

          <WeekdaySelector name="applicableDays" required={true} />
          {errors.applicableDays && (
            <p className="text-red-500 text-xs">
              {errors?.applicableDays?.message?.toString()}
            </p>
          )}

          {/* <Controller
            name="applicableDays"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div className="flex space-x-2 mt-2">
                {daysOfWeek.map((day) => {
                  const isSelected = field.value?.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      className={`border rounded-md flex px-2 py-1 ${
                        isSelected
                          ? "bg-blueTilt text-white"
                          : "text-gray-300 border-black hover:bg-blueTilt hover:text-white"
                      }`}
                      onClick={() =>
                        field.onChange(
                          toggleDaySelection(field.value || [], day.value)
                        )
                      }>
                      {day.display}
                    </button>
                  );
                })}
              </div>
            )}
          /> */}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default RedemptionDetails;
