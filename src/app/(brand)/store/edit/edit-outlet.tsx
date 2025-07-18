"use client";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import Map from "@/components/ui/Map";
import PhoneNumberInput from "@/components/ui/phone-number-input";
import { DynamicInputList } from "@/components/DynamicInputList";
import DaysOpenSelector from "@/components/WeekdaySelector";
import AccessibilityFeaturesSelector from "@/components/AccessibilityFeaturesSelector";
import TimeSelector from "@/components/TimeSelector";
import ImageUploader from "@/components/ImageUploader";
import GetLocationButton from "@/components/GetLocationButton";
import { useImageUpload } from "@/hooks/use-image";
import { OUTLET_BUCKET_NAME } from "@/utils/constants";
import { useGetOutlet, useUpdateOutlet } from "@/hooks/use-outlet";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
type OutletFormValues = {
  name: string;
  address: string;
  neighborhood: string;
  street: string;
  postal_code: string;
  manager_phone: string;
  manager_name: string;
  location: any;
  images: string[];
  days_open: string[];
  opening_hours: string;
  closing_hours: string;
  services: string[];
  amenities: string[];
  accessibility_features: Record<string, boolean>;

  // Add other fields here as needed
};

const OutletDetails = ({ id }: { id: string }) => {
  // get outlet api hook
  const {
    data,
    isLoading: outletGetLoading,
    error: outletGetError,
    isPending: outletGetPending,
  } = useGetOutlet(id);

  const role = useSelector((state: RootState) => state.brandUser.role)


  // update outlet api hook
  const {
    mutate: updateOutlet,
    isPending: outletUpdatePending,
    error: outletUpdaetError,
  } = useUpdateOutlet();

  const uploadImageToBucket = useImageUpload(OUTLET_BUCKET_NAME);

  const method = useForm<OutletFormValues>();

  const {
    watch,
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
  } = method;

  useEffect(() => {
    if (
      data &&
      typeof data.opening_hours === "object" &&
      data.opening_hours !== null
    ) {
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
      const [openingTime, closingTime] =
        typeof firstTimeRange === "string" ? firstTimeRange.split(" - ") : [];

      const initialFormValues = {
        ...data,
        opening_hours: openingTime,
        closing_hours: closingTime,
        days_open: weekdays,
      };

      reset(initialFormValues); //  update form with loaded data
    }
  }, [data, reset]);

  // submit function
  function onSubmit(data: any) {
    delete data.longitude;
    delete data.latitude;
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
    lat: data?.latitude || 77.6408,
    lng: data?.longitude || 12.9784,
  };



  const onLocationChange = (coords: [number, number]) => {
    const [lat, lng] = coords;
    setValue("location", { lat, lng });
  };



  return (
    <div className="flex md:flex-row flex-col min-h-screen md:ml-10 mx-auto md:mx-0">
      <div className="w-full md:max-w-2xl  px-4">
        <h1 className="text-2xl md:text-4xl font-bold">Outlet Details</h1>
        <p className="mt-2 text-sm md:text-base">Name, store, and address</p>
        {outletUpdaetError && (
          <div className="text-red-500 text-xs italic">
            {outletUpdaetError.message}
          </div>
        )}
        {outletGetError && (
          <div className="text-red-500 text-xs italic">
            {outletGetError.message}
          </div>
        )}
        <FormProvider {...method}>
          {outletGetLoading || outletGetPending && (
            <div className="space-y-4 mt-8">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[300px] w-full rounded-md" />
              <Skeleton className="h-10 w-40" />
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* Outlet Name */}

            <div className="my-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="name">
                Name of the outlet <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name", {
                  required: "Name is required",
                })}
                id="name"
                type="text"
                placeholder="Enter outlet name"
                className="w-full"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}

            {/* Address */}

            <div className="my-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="address">
                Address of the outlet
              </Label>
              <Input
                {...register("address", {
                  required: "Address is required",
                })}
                id="address"
                className="mt-1 w-full"
                type="text"
                placeholder="Enter the outlet address"
              />
            </div>
            {typeof errors.address?.message === "string" && (
              <p className="text-red-500 text-xs italic">
                {errors.address.message}
              </p>
            )}
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
              fieldName={`services`}
              label="Add services"
              placeholder="Enter a service"
              index={1}
            />

            {/* list of amenities */}
            <DynamicInputList
              fieldName={`amenities`}
              label="Add amenities"
              placeholder="Enter an amenity"
              index={2}
            />

            {/* accessibility feature */}
            <AccessibilityFeaturesSelector name="accessibility_features" />

            {/* Outlet Timing */}


            <div className="flex flex-row items-center space-x-2 my-6">
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

            <div className="my-6">
              <Label className="md:text-lg text-sm font-bold" htmlFor="days_open">Days Open</Label>
              <DaysOpenSelector name="days_open" />
            </div>
            {/* upload images of this outlet */}
            <div className="my-6">
              <Label className="md:text-lg text-sm font-bold" htmlFor="images">Upload Outlet Images</Label>
              <ImageUploader name="images" multiple={true} />
            </div>
            {/* preview all the images here */}

            {/* Add Outlet Button */}
            <Button type="submit" className={`w-auto my-4 ${role === "admin" ? "" : "hidden"}`}>
              {outletUpdatePending ? "Updating Outlet..." : "Update Outlet"}
            </Button>
            {/* Navigation Buttons */}
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default OutletDetails;
