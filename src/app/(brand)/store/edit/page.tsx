"use client";
import { useEffect, useState } from "react";
import Support from "../../../../../public/image/contact.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Map from "@/components/ui/Map";
import Image from "next/image";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { DynamicInputList } from "@/components/DynamicInputList";
import DaysOpenSelector from "@/components/WeekdaySelector";
import AccessibilityFeaturesSelector from "@/components/AccessibilityFeaturesSelector";
import TimeSelector from "@/components/TimeSelector";
import ImageUploader from "@/components/ImageUploader";
import GetLocationButton from "@/components/GetLocationButton";
import { useImageUpload } from "@/hooks/use-image";
import { LAMBDA_URL, OUTLET_BUCKET_NAME } from "@/utils/constants";
import { useGetOutlet, useUpdateOutlet } from "@/hooks/use-outlet";
import { useSearchParams } from "next/navigation";
const OutletDetails = () => {
  // getting outlet id from search params
  const searchParams = useSearchParams();
  const id = searchParams.get("outlet_id") || "";

  const { data, isLoading, error } = useGetOutlet(id);
  const { mutate: updateOutlet } = useUpdateOutlet();

  const uploadImageToBucket = useImageUpload(
    LAMBDA_URL + "/upload/url",
    OUTLET_BUCKET_NAME
  );

  const method = useForm();

  const {
    watch,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
  } = method;

  // populating outlet form with inital data
  useEffect(() => {
    if (data) {
      const schedule = data.opening_hours;

      const weekdays = Object.keys(schedule).sort(
        (a, b) =>
          [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].indexOf(a) -
          [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ].indexOf(b)
      );

      const firstTimeRange = Object.values(schedule)[0];
      const [openingTime, closingTime] = firstTimeRange.split(" - ");

      data.opening_hours = openingTime;
      data.closing_hours = closingTime;
      data.days_open = weekdays;

      reset(data); // ✅ update form with loaded data
    }
  }, [data, reset]);

  // submit function
  function onSubmit(data) {
    console.log("data>>", data);

    // need to uplaod images to bucket if it's file. if it's not file means it's already has filekey no need to do anything

    const images = data.images;

    if (images) {
      const promises = images.map((image: File | string) => {
        if (typeof image !== "string") {
          return uploadImageToBucket.mutateAsync(image); // ✅ return added
        } else {
          return Promise.resolve({ fileKey: image });
        }
      });

      Promise.all(promises).then((results) => {
        data.images = results.map((r) => r.fileKey);
        updateOutlet({ id, data });
      });
    } else {
      updateOutlet({ id, data });
    }
  }

  // Generate times for the outlets
  const times = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  // Remove outlet from the outlets

  const { lat, lng } = watch("location") || {
    lat: 77.6408,
    lng: 12.9784,
  };

  const onLocationChange = (coords: [number, number]) => {
    setValue("location", [77.6408, 12.9784]);
  };

  return (
    <div className="grid grid-cols-1 w-[100%]">
      <div className="flex justify-between my-10 mx-8 items-center">
        <div className="flex items-center">
          <button className="flex  items-center">
            <ChevronLeft />
            <h1 className="md:text-3xl	font-black"> New Outlet</h1>
          </button>
        </div>
        <div className=" md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
          <h3 className="md:text-xl text-xs">support@advayu.club</h3>
          <h3 className="md:text-xl text-xs">+91 9123456789</h3>
        </div>
        <Image className="md:hidden block" src={Support} alt="support" />
      </div>

      <div className="flex md:flex-row flex-col min-h-screen md:ml-10 mx-auto md:mx-0">
        <div className="w-full md:max-w-2xl  px-4">
          <h1 className="text-2xl md:text-4xl font-bold">Outlet Details</h1>
          <p className="mt-2 text-sm md:text-base">Name, store, and address</p>
          <FormProvider {...method}>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              {/* Outlet Name */}

              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="name">
                  Name of the outlet <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register(`name`, { required: true })}
                  id="name"
                  type="text"
                  placeholder="Enter outlet name"
                  className="w-full"
                />
              </div>

              {/* Address */}

              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="address">
                  Address of the outlet
                </Label>
                <Input
                  {...register(`address`, {
                    required: true,
                  })}
                  id="address"
                  className="mt-1 w-full"
                  type="text"
                  placeholder="Enter the outlet address"
                />
              </div>
              {/* Locate on Map */}
              <div className="my-4">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="location">
                  Locate on the map
                </Label>
                <div className="flex items-center gap-2 flex-row ">
                  <Input
                    type="text"
                    name="location"
                    readOnly
                    value={lat && lng ? `${lat}, ${lng}` : ""}
                    placeholder="Use map/button to locate location"
                    className="w-[50%]"
                  />
                  <GetLocationButton name="location" />
                </div>

                <Map lat={lat} long={lng} onLocationChange={onLocationChange} />
              </div>
              {/* <div className="relative mt-2">
                <Input
                  {...register(`latitude`)}
                  ref={locationRef}
                  id="location"
                  className={`pr-10 w-full my-2 `}
                  placeholder="Locate on the map"
                  readOnly
                />
              </div> */}

              {/* neighborhood */}
              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="neighborhood">
                  Neighborhood
                </Label>
                <Input
                  {...register(`neighborhood`)}
                  id="neighborhood"
                  className="mt-1 w-full"
                  type="text"
                  placeholder="Enter the  neighbor of outlet address"
                />
              </div>
              {/* street */}
              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="street">
                  Street
                </Label>
                <Input
                  {...register(`street`)}
                  className="mt-1 w-full"
                  type="text"
                  placeholder="Enter street"
                />
              </div>
              {/* postal code */}
              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="postal_code">
                  Postal code
                  <span className="text-red-500"> *</span>
                </Label>
                <Input
                  {...register(`postal_code`, {
                    required: true,
                  })}
                  id="postal_code"
                  className={`mt-1 w-full `}
                  type="text"
                  placeholder="Enter postal code"
                  maxLength={6}
                  minLength={6}
                />
              </div>
              {/* country code */}
              <div className="my-3 flex items-center ">
                <div className="flex-1">
                  <Label
                    className="text-base md:text-lg font-bold "
                    htmlFor="phoneNumber">
                    Manager mobile number
                  </Label>

                  <PhoneNumberInput
                    {...register(`manager_phone`, {
                      required: true,
                    })}
                    id="manager_phone"
                    placeholder="Mobile number at the outlet"
                  />
                </div>
              </div>
              {/* manager name */}
              <div className="my-3">
                <Label
                  className="text-base md:text-lg font-bold"
                  htmlFor="manager_name">
                  Manager name
                </Label>
                <Input
                  {...register(`manager_name`, {
                    required: true,
                  })}
                  id="manager_name"
                  className="mt-1 w-full"
                  type="text"
                  placeholder="Enter outlet manager name"
                />
              </div>

              {/* list of services */}
              <DynamicInputList
                fieldName={`service`}
                label="Add services"
                placeholder="Enter a service"
                index={1}
              />

              {/* list of amenities */}
              <DynamicInputList
                fieldName={`amenity`}
                label="Add amenities"
                placeholder="Enter an amenity"
                index={2}
              />

              {/* accessibility feature */}
              <AccessibilityFeaturesSelector name="accessibility_features" />

              {/* Outlet Timing */}
              <div className="my-6">
                <label className="text-base md:text-lg font-bold">
                  Outlet Timing
                </label>
                <div className="flex flex-row items-center space-x-2">
                  <TimeSelector
                    name="opening_hours"
                    label="Opening Time"
                    times={times}
                  />
                  <TimeSelector
                    name="closing_hours"
                    label="Closing Time"
                    times={times}
                  />
                </div>
              </div>

              <DaysOpenSelector name="days_open" />
              {/* upload images of this outlet */}
              <h4>Upload Outlet Images</h4>
              <ImageUploader name="images" multiple={true} />

              {/* preview all the images here */}

              {/* Add Outlet Button */}
              <Button
                type="submit"
                className="w-28 w-full md:w-auto"
                size="thin">
                Save
              </Button>
              {/* Navigation Buttons */}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default OutletDetails;
