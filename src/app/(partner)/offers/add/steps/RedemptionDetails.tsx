"use client";
import React from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Info } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  resetOfferDetails,
  setOfferfield,
} from "@/store/offerSlice/offerDetailsSlice";
import { useDispatch } from "react-redux";
// import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { daysOfWeek } from "@/app/Constants/constant";
import OfferDetailsShow from "../OfferDetailsShow";
// import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { saveOfferAsDraft } from "@/services/api/offers/offersApi";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface RedemptionDetailsProps {
  handleNext: () => void;
  activeStep: number;
}

// Reusable Tooltip Component
const InfoTooltip: React.FC<{ message: string }> = ({ message }) => (
  <Tooltip>
    <TooltipTrigger>
      <Info className="mx-2" size={15} />
    </TooltipTrigger>
    <TooltipContent>
      <p>{message}</p>
    </TooltipContent>
  </Tooltip>
);

// Reusable Button Component for Days
const currentDate = dayjs(); // Get the current date
dayjs.extend(utc);
dayjs.extend(timezone);
const RedemptionDetails: React.FC<RedemptionDetailsProps> = ({
  handleNext,
}) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [loadingState, setLoadingState] = useState({
    saveDraft: false,
    processed: false,
  });
  const offerDetail = useSelector((state: RootState) => state.offer);
  const brand = useSelector((state: RootState) => state.brandUser);
  const days = ["Sa", "M", "Tu", "W", "Th", "F", "Su"];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const router = useRouter();
  const [redemptionDetails, setRedemptionDetailsState] = useState({
    startDate: "",
    endDate: "",
    activeDays: [] as string[],
    maximumRedemptions: "",
    maximumRedemptionsPerUser: "",
    durationBetweenRedemptions: "",
  });

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Parse the selected date, adjusting to IST (Indian Standard Time)
    const newValue = dayjs(event.target.value)
      .tz("Asia/Kolkata", true)
      .startOf("day");

    // Log the IST date (for debugging purposes)
    console.log(
      "IST Date:",
      newValue.format("ddd, DD MMM YYYY HH:mm:ss [IST]")
    );

    // Convert the date to UTC, keeping it as a consistent time moment, and store it in UTC
    const utcDate = newValue.utc().toISOString();

    // Log the final UTC date (for debugging purposes)
    console.log("start date in UTC:", utcDate);

    // Dispatch the value as UTC, which will be stored in the database correctly
    dispatch(
      setOfferfield({
        field: "startDate",
        value: utcDate,
      })
    );
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Parse the selected end date, adjusting to IST (Indian Standard Time)
    const newValue = dayjs(event.target.value)
      .tz("Asia/Kolkata", true)
      .startOf("day");

    // Log the IST date (for debugging purposes)
    console.log(
      "IST Date:",
      newValue.format("ddd, DD MMM YYYY HH:mm:ss [IST]")
    );

    // Convert the date to UTC, keeping it as a consistent time moment, and store it in UTC
    const utcDate = newValue.utc().toISOString();

    // Log the final UTC date (for debugging purposes)
    console.log("end date in UTC:", utcDate);

    // Dispatch the value as UTC, which will be stored in the database correctly
    dispatch(
      setOfferfield({
        field: "endDate",
        value: utcDate,
      })
    );
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("YYYY-MM-DD");
  };

  // Function to toggle the selection of a day
  const toggleDaySelection = (day: string) => {
    const updatedDays = offerDetail.applicableDays.includes(day)
      ? offerDetail.applicableDays.filter(
          (selectedDay: string) => selectedDay !== day
        )
      : [...offerDetail.applicableDays, day];

    console.log("updatedatys;", updatedDays);
    // Dispatch the updated list of applicableDays to Redux
    dispatch(
      setOfferfield({
        field: "applicableDays", // the field to update
        value: updatedDays, // the updated value for applicableDays
      })
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRedemptionDetailsState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    dispatch(setOfferfield({ field: "totalLimit", value: value }));
  };

  const handleTotalLimitChange = (event: any) => {
    dispatch(setOfferfield({ field: "totalLimit", value: event.target.value }));
  };

  const handleNextClick = () => {
    setLoadingState({ ...loadingState, processed: true });
    if (offerDetail.startDate >= offerDetail.endDate) {
      toast({
        variant: "destructive",
        title: "Start date should be less than end date.",
      });
      setLoadingState({ ...loadingState, processed: false });
      return;
    }
    setLoadingState({ ...loadingState, processed: false });
    handleNext();

    console.log("offer details from store:", offerDetail);
  };

  const handleDraft = async () => {
    // const brandId = localStorage.getItem("brandId") || offerDetail.brandId;
    const brandId = brand.brand_id;
    console.log("brandId", brandId);
    setLoadingState({ ...loadingState, saveDraft: true });
    try {
      const responseCode: any = await saveOfferAsDraft(
        offerDetail, // Pass the updated details
        offerDetail.outletId,
        brandId
      );

      console.log("responseCode", responseCode);
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
        toast({
          duration: 5000,
          variant: "destructive",
          title: "Session Expired. Please login again.",
        });
        router.push("/auth");
      }
      console.error("Error saving draft:", error);
      toast({
        duration: 5000,
        variant: "destructive",
        title: "Failed to save offer as draft. Please try again.",
      });
      setLoadingState({ ...loadingState, saveDraft: false });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TooltipProvider>
        <div>
          <header>
            <h1 className="font-bold text-3xl">Redemption details</h1>
            <p className="text-2xl mt-2">
              Set validity and redemption conditions
            </p>
          </header>

          {/* Date Range */}
          <div className="mt-10">
            <h2 className="text-lg font-medium mb-4 blue-tilt">
              {offerDetail.discountType}
            </h2>
            <OfferDetailsShow />
            <div className="flex space-x-4 mt-[24.4px]">
              <div className="flex  items-center">
                <div className="flex flex-col gap-2">
                  <label className="text-xl font-bold flex items-center gap-1">
                    Start date
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formatDate(offerDetail.startDate)}
                      onChange={handleStartDateChange}
                      className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase border border-black"
                      required
                      min={dayjs().format("YYYY-MM-DD")}
                    />
                    {/* <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    /> */}
                  </div>
                </div>

                <div className="h-[1.5px] w-12 bg-black  mt-[2rem]" />

                <div className="flex flex-col gap-2">
                  <label className="text-xl font-bold">Expiry date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formatDate(offerDetail.endDate)}
                      onChange={handleEndDateChange}
                      className="w-full px-4 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase border border-black"
                      required
                      min={formatDate(offerDetail.startDate)}
                    />
                    {/* <Calendar
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    /> */}
                  </div>
                </div>
              </div>
              {/* <DatePicker
                className="py-0"
                label="Start Date"
                defaultValue={
                  offerDetail.startDate ? dayjs(offerDetail.startDate) : null
                }
                onChange={handleStartDateChange}
                minDate={currentDate} // Minimum date allowed
              />
              <DatePicker
                label="End Date"
                defaultValue={
                  offerDetail.endDate ? dayjs(offerDetail.endDate) : null
                }
                onChange={handleEndDateChange}
                minDate={
                  offerDetail.startDate
                    ? dayjs(offerDetail.startDate)
                    : currentDate
                }
              /> */}
            </div>
          </div>

          {/* Select Days */}
          <div className="mt-6">
            <h2 className="text-xl font-bold flex items-center">
              Select days it will run
              <InfoTooltip message="Select days to run" />
            </h2>
            <div className="flex space-x-2 mt-2">
              {daysOfWeek.map((day, index) => (
                <button
                  key={index}
                  className={`border rounded-md flex px-2 py-1  ${
                    offerDetail.applicableDays.includes(day.value)
                      ? "bg-blueTilt text-white"
                      : "text-gray-300 border-black hover:bg-blueTilt hover:text-white"
                  }`}
                  onClick={() => toggleDaySelection(day.value)}>
                  {day.display}
                </button>
              ))}
            </div>
          </div>

          {/* <div className="my-6">
            <Label className="text-base md:text-lg font-bold">
              Days Open in a Week
            </Label>

            <ToggleGroup
              type="multiple"
              className="mt-2 flex flex-wrap gap-2"
              value={currentOutlet.daysOpen || []}
              onValueChange={handleDaysOpenChange}
            >
              {daysOfWeek.map(({ display, value }) => (
                <ToggleGroupItem key={value} value={value}>
                  {display}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div> */}

          {/* Input Fields */}
          <div className="mt-4">
            <Label className="flex items-center text-xl font-bold">
              Maximum offer redemptions
              <InfoTooltip message="Maximum number of redemptions allowed" />
            </Label>
            <Input
              type="text"
              placeholder="Enter maximum number"
              name="totalLimit"
              className="w-52 mt-[7.5px]"
              defaultValue={offerDetail.totalLimit}
              onChange={handleTotalLimitChange}
            />
          </div>

          {/* <div className="my-6">
            <Label className="flex items-center text-xl font-bold">
              Maximum offer redemptions{" "}
              <span className=" ml-2 underline">per user</span>
              <InfoTooltip message="Maximum number of redemptions per user" />
            </Label>
            <Input
              id="maximumRedemptionsPerUser"
              type="text"
              name="maximumRedemptionsPerUser"
              placeholder="Enter maximum number"
              className="w-52 mt-[7.5px]"
              defaultValue={""}
              onChange={handleInputChange}
            />
          </div>

          <div className="mt-4">
            <Label className="flex items-center text-xl font-bold">
              Duration between redemptions (days)
              <InfoTooltip message="Enter the number of days between redemptions" />
            </Label>
            <Input
              id="durationBetweenRedemptions"
              name="durationBetweenRedemptions"
              type="text"
              placeholder="Enter duration"
              className="w-52 mt-[7.5px]"
              onChange={handleInputChange}
            />
          </div> */}

          {/* Buttons */}
          <div className="flex space-x-2 justify-end mt-6">
            <Button
              disabled={loadingState.saveDraft}
              onClick={handleDraft}
              variant="outline"
              className="w-40"
              size="thin">
              {loadingState.saveDraft ? "Saving..." : "Save Draft"}
            </Button>
            <Button
              disabled={loadingState.processed}
              className="w-40"
              size="thin"
              onClick={handleNextClick}>
              {loadingState.processed ? "Processing..." : "processed"}
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </LocalizationProvider>
  );
};

export default RedemptionDetails;
