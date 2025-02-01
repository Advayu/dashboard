"use client";
import checker from "../../../../../public/image/checker.svg";
import { useState, useRef, useEffect } from "react";
import Support from "../../../../../public/image/contact.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, LocateFixed } from "lucide-react";
// import Map from "@/components/ui/Map";
import dynamic from "next/dynamic";
const Map = dynamic(() => import("@/components/ui/Map"), { ssr: false });
// import { RadioGroup } from "@radix-ui/react-radio-group";
// import { RadioGroupItem } from "@/components/ui/radio-group";
// import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import {
  AWS_IMAGE_UPLOAD_URL,
  daysOfWeek,
  LAMBDA_URL,
  // accessibilityFeatureList,
  // paymentMethodsOptions,
  // customerCapacities,
} from "@/utils/constants";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  setCurrentOutlet,
  addOutlet,
  clearCurrentOutlet,
  removeOutlet,
  removeCurrentOutletImage,
  addCurrentOutletImage,
  addCurrentOutletImagesUrl,
  toggleAccessibilityFeature,
  resetOutlets,
} from "@/store/slices/outletSlice";
import { Trash } from "lucide-react";

import { postOutletData } from "@/services/api/outlets/outletsApi";
import {
  deleteImageFromBucket,
  getFileFromBucket,
  uploadImageToBucket,
} from "@/services/ImageService";

import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { set } from "date-fns";

const OutletDetails = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const outlets = useSelector((state: RootState) => state.outlets.outlet);
  const userBrand = useSelector((state: RootState) => state.brandUser);
  const brand = useSelector((state: RootState) => state.brand);
  const [loadingStates, setLoadingStates] = useState({
    uploadingImages: false,
    savingData: false,
  });
  const [isFetching, setIsFetching] = useState(false);
  const currentOutlet = useSelector(
    (state: RootState) => state.outlets.currenOutlet
  );

  // const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  // const outletDetails = useSelector((state: any) => state.outlet);
  //Todo: do better logic
  // const [isVerified, setIsVerified] = useState(false);
  console.log("outlets", outlets);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateFields = () => {
    console.log("validateFields called");
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!currentOutlet.name.trim()) newErrors.name = "Name is required.";

    // Validate postal_code only if it is not empty
    if (!currentOutlet.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required.";
    }
    if (
      currentOutlet.postal_code.trim() !== "" &&
      !/^[0-9]{6}$/.test(currentOutlet.postal_code)
    ) {
      newErrors.postal_code = "Postal code must be valid (5 digits).";
    }

    // Validate manager_phone
    if (
      currentOutlet.manager_phone &&
      !/^\d{10}$/.test(currentOutlet.manager_phone)
    ) {
      newErrors.phoneNumber = "Phone number must be valid.";
    }
    if (!currentOutlet.latitude || !currentOutlet.longitude) {
      newErrors.location = "Location is required.";
    }

    return newErrors;
  };

  const times = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  // const [previewOutletImages, setPreviewOutletImages] = useState<
  //   { file: File; preview: string }[]
  // >([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional for smooth scrolling
    });
    if (errors.name && nameRef.current) {
      // nameRef.current.scrollIntoView({ behavior: "smooth" });
      nameRef.current.focus();
    } else if (errors.phoneNumber) {
      // phoneNumberRef.current?.scrollIntoView({ behavior: "smooth" });
      phoneNumberRef.current?.focus();
    } else if (errors.postal_code) {
      // postalCodeRef.current?.scrollIntoView({ behavior: "smooth" });
      postalCodeRef.current?.focus();
    } else if (errors.location) {
      // locationRef.current?.scrollIntoView({ behavior: "smooth" });
      locationRef.current?.focus();
    }
  }, []);

  const handleLoadingState = (key: string, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("name:", name, "value:", value);

    // check contans numbar should be number
    setErrors((prev) => ({ ...prev, [name]: "" }));

    dispatch(setCurrentOutlet({ ...currentOutlet, [name]: value }));
  };

  // const handleCustomerCapacityChange = (value: string) => {
  //   // todo: update currentOutlet state of store
  //   dispatch(setCurrentOutlet({ ...currentOutlet, customerCapacity: value }));
  // };

  // Handle payment method change
  // const handleCheckboxChange = (method: string, checked: boolean) => {
  //   //  todo: update currentOutlet state of store
  //   dispatch(
  //     setCurrentOutlet({
  //       ...currentOutlet,
  //       methodsOfPayment: checked
  //         ? [...currentOutlet.methodsOfPayment, method]
  //         : currentOutlet.methodsOfPayment.filter((m) => m !== method),
  //     })
  //   );
  // };

  // Handle remove preview button click

  // const handleRemovePreview = (index: number) => {
  //   dispatch(removeCurrentOutletImage(index));
  //   console.log("remove ");
  //   // setPreviewOutletImages((prev) => prev.filter((_, i) => i !== index));
  //   // setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  // };

  const handleDaysOpenChange = (selectedDays: string[]) => {
    console.log("Selected Days:", selectedDays);
    dispatch(setCurrentOutlet({ ...currentOutlet, days_open: selectedDays }));
  };
  const isAllSelected =
    currentOutlet.days_open &&
    daysOfWeek.every((day) => currentOutlet.days_open.includes(day.value));
  // Function to toggle selection of all days
  const toggleSelectAll = () => {
    const allDays = daysOfWeek.map((day) => day.value);
    const isAllSelected =
      currentOutlet.days_open &&
      daysOfWeek.every((day) => currentOutlet.days_open.includes(day.value));

    handleDaysOpenChange(isAllSelected ? [] : allDays);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const url = AWS_IMAGE_UPLOAD_URL;
    const bucket_name = "advayu-onboarding-assets/outlet-assets";

    if (files) {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        handleLoadingState("uploadingImages", true);
        try {
          // Upload each file
          const uploadImage = await uploadImageToBucket({
            file,
            bucket_name,
            url,
            maxFileSize: 2 * 1024 * 1024, // Optional: file size limit of 2 MB
          });

          if (uploadImage && uploadImage.fileKey) {
            const fileKey = uploadImage.fileKey;

            // Retrieve the uploaded file's URL (optional)
            const fileData = await getFileFromBucket(
              fileKey,
              bucket_name,
              AWS_IMAGE_UPLOAD_URL
            );

            const imageUrl = fileData.fileUrl;
            console.log("Image URL:", imageUrl);

            // Dispatch the fileKey to the Redux store
            dispatch(addCurrentOutletImage(fileKey));

            // Optionally update local state for preview or other purposes
            dispatch(addCurrentOutletImagesUrl(imageUrl));
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
          ) {
            console.log("Unauthorized: Redirecting to login...");
            router.push("/auth");
          } else {
            console.error("An error occurred", error);
          }
        }
      }

      handleLoadingState("uploadingImages", false);
      // Clear the input value to allow re-uploading the same file if needed
      e.target.value = "";
    }
  };

  // remove images

  const removeImage = async (imageUrl: string, index: number) => {
    if (!imageUrl) return;

    try {
      // Parse the image URL to extract the fileKey
      const url = new URL(imageUrl);
      const fileKey = url.pathname.split("/").slice(-1)[0]; // Extract the file key

      // Call the API to delete the image from the bucket
      const deleteImageResponse = await deleteImageFromBucket(
        fileKey,
        "advayu-onboarding-assets/outlet-assets",
        `${LAMBDA_URL}/upload/file`
      );

      console.log("Delete response:", deleteImageResponse);

      // Dispatch an action to remove the image from the Redux state
      dispatch(removeCurrentOutletImage(index)); // Assumes you have a reducer to handle this
      // setImages((prevImages) => prevImages.filter((_, i) => i !== index));

      console.log("Image deleted successfully. File Key:", fileKey);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // handle get geo location
  const handleLocationUpdate = (coords?: [number, number]) => {
    console.log("coords in parent", coords);
    setIsFetching(true); // Start fetching indicator
    // remove error on change of input
    setErrors((prev) => ({ ...prev, location: "" }));

    if (coords) {
      // Update location based on provided coordinates
      const [latitude, longitude] = coords;
      dispatch(
        setCurrentOutlet({
          ...currentOutlet,
          latitude: latitude,
          longitude: longitude,
        })
      );
      console.log("Updated Coordinates in Parent Component:", coords);
      setIsFetching(false); // Stop fetching indicator
    } else {
      // Get current location using Geolocation API
      console.log("handleLocationClick clicked");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(
              setCurrentOutlet({
                ...currentOutlet,
                latitude: latitude,
                longitude: longitude,
              })
            );
            console.log("Current Location:", { latitude, longitude });
            setIsFetching(false); // Stop fetching indicator on success
          },
          (error) => {
            console.error("Error getting location:", error);
            setIsFetching(false); // Stop fetching indicator on error
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        setIsFetching(false); // Stop fetching if geolocation is unsupported
      }
    }
  };

  const addOutletHandler = () => {
    const newErrors = validateFields(); // Validate all fields
    console.log("newErrors", newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Focus on the first field with an error
      const firstErrorKey = Object.keys(newErrors)[0];
      const errorFieldRef = {
        name: nameRef,
        postal_code: postalCodeRef,
        manager_phone: phoneNumberRef,
        location: locationRef,
      }[firstErrorKey];

      if (errorFieldRef && errorFieldRef.current) {
        errorFieldRef.current.focus();
      }
      return;
    }

    // If no validation errors, proceed with the rest of the logic
    dispatch(setCurrentOutlet(currentOutlet));
    dispatch(addOutlet(currentOutlet));
    dispatch(clearCurrentOutlet());

    console.log("Current Outlet added:", currentOutlet);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleSave = async () => {
    try {
      handleLoadingState("savingData", true);

      // Step 1: Save brand data and get brand ID
      const brandId = localStorage.getItem("brandId") || userBrand.brand_id;

      // Step 2: Save all outlets data
      const responseOutletData = await Promise.all(
        outlets.map(async (outlet) => {
          try {
            const response = await postOutletData(outlet, brandId);
            console.log("responseOutletData", response);
            return response;
          } catch (error) {
            console.error(`Error saving outlet: ${outlet.name}`, error);
            throw error; // Propagate the error to the main catch block
          }
        })
      );

      // Step 3: Success toast and proceed to next actions

      toast({
        variant: "success",
        title: "Success",
        description: "Saved successfully.",
        duration: 5000,
      });
      console.log("Brand and outlet data saved successfully.");
      dispatch(resetOutlets());
      router.push("/store");
      handleLoadingState("savingData", false);

      // Continue with other actions (e.g., navigate to the next step)
    } catch (error) {
      // Handle any errors during the save operation
      handleLoadingState("savingData", false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error during save operation. Please try again.",
        duration: 5000,
      });
      console.error("Error during save operation:", error);
    }
  };

  const handleRemoveOutlet = (index: number) => {
    console.log("Removing outlet at index:", index);
    dispatch(removeOutlet(index)); // Dispatch action to remove outlet
  };

  // const PaymentMethodCheckbox: React.FC<{
  //   method: string;
  //   isChecked: boolean;
  //   onChange: (checked: boolean) => void;
  // }> = ({ method, isChecked, onChange }) => (
  //   <div key={method} className="flex items-center space-x-2">
  //     <Checkbox
  //       id={`payment-${method}`}
  //       checked={isChecked}
  //       onCheckedChange={onChange}
  //       className=""
  //     />
  //     <Label htmlFor={`payment-${method}`}>{method}</Label>
  //   </div>
  // );

  const handleServiceAdd = () => {
    console.log("current service", currentOutlet.service);

    // Validate the service before adding
    if (!currentOutlet.service) {
      console.warn("Service cannot be empty.");
      return;
    }

    if (currentOutlet.services.includes(currentOutlet.service)) {
      console.warn("Service already exists.");
      return;
    }

    // Add the `service` to `services` and clear `service` in a single dispatch
    const updatedServices = [...currentOutlet.services, currentOutlet.service];

    dispatch(
      setCurrentOutlet({
        ...currentOutlet,
        services: updatedServices,
        service: "", // Clear the temporary service field
      })
    );

    console.log("Updated services:", updatedServices);
  };

  const handleRemoveService = (indexToRemove: number) => {
    console.log("Index to remove:", indexToRemove);

    // Validate if the index is within bounds
    if (indexToRemove < 0 || indexToRemove >= currentOutlet.services.length) {
      console.warn("Invalid index. No service removed.");
      return;
    }

    // Filter out the service at the specified index
    const updatedServices = currentOutlet.services.filter(
      (_, index) => index !== indexToRemove
    );

    // Update the state with the new services array
    dispatch(
      setCurrentOutlet({
        ...currentOutlet,
        services: updatedServices,
      })
    );

    console.log("Updated services after removal:", updatedServices);
  };
  const handleAddAmenity = () => {
    console.log("Current amenity:", currentOutlet.amenity);
    console.log("Current amenities:", currentOutlet.amenities);

    // Ensure the `amenity` is non-empty before adding it to the list
    if (currentOutlet.amenity.trim() === "") {
      console.log("Amenity cannot be empty.");
      return;
    }

    // Update the `amenities` array and clear the `amenity` field in a single dispatch
    dispatch(
      setCurrentOutlet({
        ...currentOutlet,
        amenities: [...currentOutlet.amenities, currentOutlet.amenity],
        amenity: "", // Clear the `amenity` field
      })
    );

    console.log("Updated amenities:", [
      ...currentOutlet.amenities,
      currentOutlet.amenity,
    ]);
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    console.log("Index to remove:", indexToRemove);

    // Validate if the index is within bounds
    if (indexToRemove < 0 || indexToRemove >= currentOutlet.amenities.length) {
      console.warn("Invalid index. No amenity removed.");
      return;
    }

    // Filter out the amenity at the specified index
    const updatedAmenities = currentOutlet.amenities.filter(
      (_, index) => index !== indexToRemove
    );

    // Update the state with the new amenities array
    dispatch(
      setCurrentOutlet({
        ...currentOutlet,
        amenities: updatedAmenities,
      })
    );

    console.log("Updated amenities after removal:", updatedAmenities);
  };

  type AccessibilityFeatureKey =
    keyof typeof currentOutlet.accessibility_features;

  const handleCheckboxChange = (feature: AccessibilityFeatureKey) => {
    console.log("Feature:", feature);
    const updatedValue = !currentOutlet.accessibility_features[feature];
    dispatch(toggleAccessibilityFeature({ feature, value: updatedValue }));
  };

  const areAllFeaturesSelected = Object.values(
    currentOutlet.accessibility_features
  ).every((value) => value);

  const handleToggleAllFeatures = () => {
    const updatedFeatures = Object.keys(
      currentOutlet.accessibility_features
    ).map((key) => {
      const feature = key as AccessibilityFeatureKey; // Explicitly assert the type
      return {
        feature,
        value: !areAllFeaturesSelected,
      };
    });

    console.log("Updated features:", updatedFeatures);

    // Dispatch each feature update individually
    updatedFeatures.forEach(({ feature, value }) =>
      dispatch(toggleAccessibilityFeature({ feature, value }))
    );
  };

  function handleBackClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (typeof window !== "undefined") {
      event.preventDefault();
      window.history.back();
    }

    console.log("hello go back ");
  }

  return (
    // <>
    // {!isVerified ?
    // (
    <div className="grid grid-cols-1 w-[100%]">
      <div className="flex justify-between my-10 mx-8 items-center">
        <div className="flex items-center">
          <button className="flex  items-center" onClick={handleBackClick}>
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

          <div className="mt-8">
            {/* Outlet Name */}
            <div className="my-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="name">
                Name of the outlet <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter outlet name"
                value={currentOutlet.name}
                onChange={handleInputChange}
                ref={nameRef}
                className={`w-full mt-2 ${errors.name ? "border-red-500" : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            {/* Address */}
            <div className="my-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="address">
                Address of the outlet
              </Label>
              <Input
                id="address"
                name="address"
                className="mt-1 w-full"
                type="text"
                placeholder="Enter the outlet address"
                value={currentOutlet.address}
                onChange={handleInputChange}
              />
            </div>
            {/* Locate on Map */}
            <div className="my-4">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="location">
                Locate on the map
              </Label>
              <div className="relative mt-2">
                <Input
                  ref={locationRef}
                  id="location"
                  className={`pr-10 w-full my-2 ${
                    errors.location ? "border-red-500" : ""
                  }`}
                  placeholder="Locate on the map"
                  value={
                    currentOutlet.latitude && currentOutlet.longitude
                      ? `Latitude: ${currentOutlet.latitude}, Longitude: ${currentOutlet.longitude}`
                      : "No location selected"
                  }
                  readOnly
                />
                <div
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center ${
                    isFetching ? "opacity-50 pointer-events-none" : ""
                  } ${errors.location ? "border-red-500" : ""}`}>
                  <LocateFixed
                    className={`cursor-pointer ${
                      isFetching ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={() => handleLocationUpdate()}
                  />
                  {isFetching && (
                    <span className="ml-2 flex items-center text-sm text-gray-600">
                      <svg
                        className="animate-spin h-4 w-4 mr-1 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      Fetching location...
                    </span>
                  )}
                </div>
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
              <Map
                lat={currentOutlet.latitude || 12.9774047}
                long={currentOutlet.longitude || 77.5742339}
                onLocationChange={handleLocationUpdate}
              />
            </div>
            {/* neighborhood */}
            <div className="my-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="neighborhood">
                Neighborhood
              </Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                className="mt-1 w-full"
                type="text"
                placeholder="Enter the  neighbor of outlet address"
                value={currentOutlet.neighborhood}
                onChange={handleInputChange}
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
                id="street"
                name="street"
                className="mt-1 w-full"
                type="text"
                placeholder="Enter street"
                value={currentOutlet.street}
                onChange={handleInputChange}
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
                id="postal_code"
                name="postal_code"
                className={`mt-1 w-full ${
                  errors.postal_code ? "border-red-500" : ""
                }`}
                type="text"
                placeholder="Enter postal code"
                value={currentOutlet.postal_code}
                maxLength={6}
                minLength={6}
                onChange={handleInputChange}
                ref={postalCodeRef}
              />
              {errors.postal_code && (
                <span className="text-red-500">{errors.postal_code}</span>
              )}
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
                  value={currentOutlet.manager_phone}
                  onChange={handleInputChange}
                  ref={phoneNumberRef}
                  id="manager_phone"
                  name="manager_phone"
                  placeholder="Mobile number at the outlet"
                  error={!!errors.phoneNumber} // Pass the error prop
                />
                {errors.phoneNumber && (
                  <span className="text-red-500">{errors.phoneNumber}</span>
                )}
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
                id="manager_name"
                name="manager_name"
                className="mt-1 w-full"
                type="text"
                placeholder="Enter outlet manager name"
                value={currentOutlet.manager_name}
                onChange={handleInputChange}
              />
            </div>
            {/* services */}
            {/* <div className="my-3">
            <Label
              className="text-base md:text-lg font-bold"
              htmlFor="services">
              Services
            </Label>
            <Input
              id="services"
              name="services"
              className="mt-1 w-full"
              type="text"
              placeholder="Enter outlet services "
              value={currentOutlet.services}
              onChange={handleInputChange}
            />
          </div> */}
            {/* list of services */}

            <div className="my-3">
              <h3 className="text-base md:text-lg font-bold">Add services</h3>
              <div className="relative flex items-center  my-1">
                <Input
                  id="service"
                  name="service"
                  type="text"
                  placeholder="Enter service"
                  value={currentOutlet.service}
                  onChange={handleInputChange}
                  className="border border-black rounded p-2 pr-20 w-full"
                />
                <button
                  onClick={handleServiceAdd}
                  className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
                  Add
                </button>
              </div>
              {errors.socialUrl && (
                <span className="text-red-500">{errors.socialUrl}</span>
              )}

              {/* Preview services */}
              {currentOutlet.services.length > 0 && (
                <div className="mt-2 space-y-2">
                  {currentOutlet.services.map((link: string, index: number) => (
                    <div
                      key={index}
                      className="relative flex items-center max-w-sm">
                      <span className=" px-2 py-1 border border-black w-full overflow-auto rounded">
                        {link}
                      </span>
                      <button
                        onClick={() => handleRemoveService(index)}
                        className="absolute right-0 bg-[#0000004D] rounded-full transform translate-x-[43%] -translate-y-[97%]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-black"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* end list of services */}

            {/* amenities */}
            {/* <div className="my-3">
            <Label
              className="text-base md:text-lg font-bold"
              htmlFor="amenities">
              Amenities
            </Label>
            <Input
              id="amenities"
              name="amenities"
              className="mt-1 w-full"
              type="text"
              placeholder="Enter amenities"
              value={currentOutlet.amenities}
              onChange={handleInputChange}
            />
          </div> */}

            {/* list of ammenitites */}

            <div className="my-3">
              <h3 className="text-base md:text-lg font-bold">Add ammenities</h3>
              <div className="relative flex items-center  my-1">
                <Input
                  id="amenity"
                  name="amenity"
                  type="text"
                  placeholder="Enter amenity"
                  value={currentOutlet.amenity}
                  onChange={handleInputChange}
                  className="border border-black rounded p-2 pr-20 w-full"
                />
                <button
                  onClick={handleAddAmenity}
                  className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
                  Add
                </button>
              </div>

              {/* Preview ammenities */}
              {currentOutlet.amenities.length > 0 && (
                <div className="mt-2 space-y-2">
                  {currentOutlet.amenities.map(
                    (link: string, index: number) => (
                      <div
                        key={index}
                        className="relative flex items-center max-w-sm">
                        <span className=" px-2 py-1 border border-black w-full overflow-auto rounded">
                          {link}
                        </span>
                        <button
                          onClick={() => handleRemoveAmenity(index)}
                          className="absolute right-0 bg-[#0000004D] rounded-full transform translate-x-[43%] -translate-y-[97%]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            {/* end list of ammenitites */}

            {/* accessibility feature */}
            <div>
              <h2 className="text-xl font-semibold">Accessibility Features</h2>
              <Button
                onClick={handleToggleAllFeatures}
                size={"thin"}
                className={`mt-4 ${
                  areAllFeaturesSelected
                    ? "bg-blueTilt text-white"
                    : " bg-gray-400 text-white "
                }`}>
                {areAllFeaturesSelected ? "Deselect All" : "Select All"}
              </Button>
              <div className="mt-2">
                {Object.entries(currentOutlet.accessibility_features).map(
                  ([feature, value]) => {
                    // Type assertion to ensure `feature` is a valid key of `AccessibilityFeatures`
                    const featureKey = feature as AccessibilityFeatureKey;

                    return (
                      <div
                        key={feature}
                        className="flex items-center space-x-4 my-2">
                        <Checkbox
                          checked={value}
                          onCheckedChange={() =>
                            handleCheckboxChange(featureKey)
                          }
                          aria-checked={value ? "true" : "false"} // aria-checked for accessibility
                          className=""
                        />
                        <label className=" capitalize">
                          {feature.replace("_", " ")}
                        </label>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            {/* Outlet Timing */}
            <div className="my-6">
              <label className="text-base md:text-lg font-bold">
                Outlet Timing
              </label>
              <div className="flex items-center  space-x-2">
                {/* Opening Time */}
                <div className="flex items-center">
                  <select
                    name="opening_time"
                    className="mt-1  py-1 px-1 border rounded"
                    value={currentOutlet.opening_time}
                    onChange={handleInputChange}>
                    <option value="">Opening Time</option>
                    {times.map((time) => (
                      <option key={`open-${time}`} value={`${time}:00 AM`}>
                        {time}:00 AM
                      </option>
                    ))}
                    {times.map((time) => (
                      <option key={`open-${time}-pm`} value={`${time}:00 PM`}>
                        {time}:00 PM
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-500 ">-</span>

                {/* Closing Time */}
                <div className="flex items-center ">
                  <select
                    name="closing_time"
                    className="mt-1  py-1 px-1 border rounded"
                    value={currentOutlet.closing_time}
                    onChange={handleInputChange}>
                    <option value="">Closing Time</option>
                    {times.map((time) => (
                      <option key={`close-${time}`} value={`${time}:00 AM`}>
                        {time}:00 AM
                      </option>
                    ))}
                    {times.map((time) => (
                      <option key={`close-${time}-pm`} value={`${time}:00 PM`}>
                        {time}:00 PM
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Days Open */}
            <div className="my-6">
              <Label className="text-base md:text-lg font-bold">
                Days Open in a Week
              </Label>
              <Button
                onClick={toggleSelectAll}
                className={`ml-4 ${
                  isAllSelected
                    ? "bg-blueTilt text-white"
                    : " bg-gray-400 text-white "
                }`}
                size="thin">
                {currentOutlet.days_open &&
                daysOfWeek.every((day) =>
                  currentOutlet.days_open.includes(day.value)
                )
                  ? "Deselect All"
                  : "Select All"}
              </Button>
              <div className="mt-2 flex flex-wrap gap-2 items-center">
                <ToggleGroup
                  type="multiple"
                  className="flex flex-wrap gap-2"
                  value={currentOutlet.days_open || []}
                  onValueChange={handleDaysOpenChange}>
                  {daysOfWeek.map(({ display, value }) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      className="cursor-pointer">
                      {display}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>

                {/* Select All Button */}
              </div>
            </div>
            {/* customer capacity */}
            {/* <div>
            <p className="font-bold">Customer capacity</p>
            <RadioGroup
              value={currentOutlet.customerCapacity}
              onValueChange={handleCustomerCapacityChange}>
              {customerCapacities.map((capacity) => (
                <div
                  key={capacity}
                  className="flex items-center space-x-2 mt-2">
                  <RadioGroupItem value={capacity} />
                  <Label>{capacity}</Label>
                </div>
              ))}
            </RadioGroup>
          </div> */}
            {/* payment methods to accept */}
            {/* <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
            <Label
              className="text-base md:text-lg font-bold"
              htmlFor="paymentMethods">
              Select the payment method you accept{" "} */}
            {/* <span className="text-red-500">*</span> */}
            {/* </Label> */}
            {/* <div id="paymentMethods" className="space-y-2">
              {paymentMethodsOptions.map((method) => (
                <PaymentMethodCheckbox
                  key={method}
                  method={method}
                  isChecked={currentOutlet.methodsOfPayment.includes(method)}
                  onChange={(checked) => handleCheckboxChange(method, checked)}
                />
              ))}
            </div>
          </div> */}
            {/* upload images of this outlet */}
            <div className="flex flex-col">
              <p className="font-bold">Upload images of this outlet</p>

              <input
                type="file"
                multiple // Allow multiple image uploads
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="fileInput"
                disabled={loadingStates.uploadingImages}
              />

              <label
                aria-disabled={!loadingStates.uploadingImages}
                htmlFor="fileInput"
                className="border border-black text-black px-4 rounded cursor-pointer my-1 w-fit">
                Attach image
              </label>

              {/* Display loading indicator */}
              {loadingStates.uploadingImages && (
                <p className="text-blue-500 font-medium mt-2">
                  Uploading images...
                </p>
              )}
            </div>

            {/* preview all the images here */}
            <div className="flex flex-wrap gap-2 mt-4">
              {currentOutlet.imagesUrl.map((src: string, index: number) => (
                <div key={index} className="relative">
                  <Image
                    width={200}
                    height={200}
                    src={src}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeImage(src, index)}
                    className="absolute right-0 top-0 bg-[#0000004D] rounded-full transform translate-x-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-black"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {/* Add Outlet Button */}
            <Button
              variant="outline"
              size="thin"
              className="mt-3 w-full md:w-auto"
              onClick={addOutletHandler}>
              + Add Outlet
            </Button>
            {/* Navigation Buttons */}
            <div className="flex space-x-3  my-8">
              {/*<Button
              className="w-28 border font-bold mr-2"
              variant="outline"
              size="thin"
              onClick={handleNext}
            >
              Skip
            </Button>*/}
              {/* disable unitl user add atleast one outlet */}
              <Button
                disabled={outlets.length === 0 || loadingStates.savingData}
                className="w-28"
                size="thin"
                onClick={handleSave}>
                {loadingStates.savingData ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* loop list of outlets */}

        <div className="flex flex-col md:items-center mt-8 space-y-6  w-full">
          <h2 className="text-2xl font-bold text-gray-800">List of Outlets</h2>
          {outlets.length === 0 && <p>No outlets added yet.</p>}
          {outlets.length > 0 && (
            <div className=" ">
              {outlets.map((outlet: any, index: number) => (
                <div
                  key={index}
                  className=" max-w-80  relative flex flex-row  gap-4  justify-between p-4 bg-white border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow">
                  {/* Outlet Info Section */}
                  <div className=" flex flex-row gap-4 items-left">
                    <Image
                      src={
                        outlet.images.length > 0 ? outlet.imagesUrl[0] : checker
                      }
                      alt="Outlet Image"
                      width={100}
                      height={100}
                      className="rounded-lg "
                    />

                    <div className="flex flex-col max-w-[60%] ">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {outlet.name}
                      </h3>
                      <p className="text-sm text-gray-600 ">{outlet.address}</p>
                    </div>
                  </div>

                  {/* Remove Button */}

                  <Trash
                    className="max-w-4 h-4 hover:cursor-pointer hover:text-red-500"
                    onClick={() => handleRemoveOutlet(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletDetails;
