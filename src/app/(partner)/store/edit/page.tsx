"use client";
import { useState, useRef, useEffect, use } from "react";
import Support from "/public/image/contact.svg";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LocateFixed, Minus, Radio } from "lucide-react";
import dynamic from "next/dynamic";
import { Checkbox } from "@/components/ui/checkbox";

const Map = dynamic(() => import("@/components/ui/Map"), { ssr: false });
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import {
  daysOfWeek,
  paymentMethodsOptions,
  customerCapacities,
  LAMBDA_URL,
  AWS_IMAGE_UPLOAD_URL,
  OUTLET_BUCKET_NAME,
} from "@/utils/constants";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/onboardingStore";
import {
  setCurrentOutlet,
  addOutlet,
  clearCurrentOutlet,
  removeOutlet,
  removeCurrentOutletImage,
  addCurrentOutletImage,
} from "@/store/slices/outletSlice";
import { Trash } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { setOutletData2 } from "@/store/globalSlice/outletSlice";
import axios from "axios";
import { generateUniqueUUID } from "@/functions/function";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/loading";
import {
  getImageURlByFileKey,
  uploadImageToBucket,
  deleteImageFromBucket,
} from "@/services/ImageService";
import axiosInstance from "@/utils/axiosInstance";
import { set } from "date-fns";
import { patchOutletData } from "@/services/api/outlets/outletsApi";

export default function Page() {
  const dispatch = useDispatch();
  const router = useRouter();
  const outlet = useSelector((state: any) => state.outlet2);
  const brandId = useSelector((state: any) => state.brandDetails?.id);
  const [loadingStates, setLoadingStates] = useState({
    uploadingImages: false,
    savingData: false,
    fetchingData: false,
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const [outletDetails, setOutletDetails] = useState<any>(null);
  const [outletId, setOutletId] = useState<string | null>(null);
  const [images, setImages] = useState<{ images: string[] }>({ images: [] });

  useEffect(() => {
    console.log("useEffect called");

    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const outletId = urlParams.get("outlet_id");
      setOutletId(outletId);
      setLoadingStates((prev) => ({ ...prev, fetchingData: true }));

      const getOutlet = async () => {
        try {
          const response = await axiosInstance.get(
            `${LAMBDA_URL}/v1/outlets/${outletId}`,
            { withCredentials: true }
          );

          if (response.status === 200) {
            console.log("response.data", response.data);

            // Get file keys and fetch URLs
            const fileKeys = response.data?.images || [];
            const imageUrls = await Promise.all(
              fileKeys.map((key: any) =>
                getImageURlByFileKey(
                  key,
                  OUTLET_BUCKET_NAME,
                  `${LAMBDA_URL}/upload/url`
                ).then((res) => res.fileUrl)
              )
            );
            setImages((prev) => ({ ...prev, images: imageUrls }));

            // Extract opening hours
            const openingHours = response.data?.opening_hours || {};
            const days = Object.keys(openingHours);
            let openTime = "";
            let closeTime = "";

            if (Object.values(openingHours).length > 0) {
              [openTime, closeTime] = (Object.values(openingHours)[0] as string)
                .split("-")
                .map((time) => time.trim());
            }

            // Update outlet details
            setOutletDetails((prev: any) => ({
              ...response.data,
              days_open: days,
              opening_time: openTime,
              closing_time: closeTime,
            }));
          }
        } catch (err) {
          console.error("Error fetching outlet detail:", err);
          toast({
            duration: 5000,
            variant: "destructive",
            title: "Failed to fetch outlet details. Please try again.",
          });
          router.push("/");
        } finally {
          setLoadingStates((prev) => ({ ...prev, fetchingData: false }));
        }
      };

      getOutlet();
    }
  }, []);

  //   const outletDetails = useSelector((state: any) => state.outlet);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateFields = () => {
    console.log("validateFields called");
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!outletDetails.name.trim()) newErrors.name = "Name is required.";

    // Validate postal_code only if it is not empty
    if (!outletDetails.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required.";
    }
    if (
      outletDetails.postal_code.trim() !== "" &&
      !/^[0-9]{6}$/.test(outletDetails.postal_code)
    ) {
      newErrors.postal_code = "Postal code must be valid (5 digits).";
    }

    // Validate manager_phone
    if (
      outletDetails.manager_phone &&
      !/^\d{10}$/.test(outletDetails.manager_phone)
    ) {
      console.log("outletDetails.manager_phone", outletDetails.manager_phone);
      newErrors.phoneNumber = "Phone number must be valid.";
    }

    return newErrors;
  };

  const times = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  useEffect(() => {
    if (errors.name && nameRef.current) {
      nameRef.current.scrollIntoView({ behavior: "smooth" });
      nameRef.current.focus();
    } else if (errors.phoneNumber) {
      phoneNumberRef.current?.scrollIntoView({ behavior: "smooth" });
      phoneNumberRef.current?.focus();
    }
  }, [errors.name, nameRef, errors.phoneNumber, phoneNumberRef]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // if (name === "manager_phone") {
    // }
    // check contans numbar should be number

    setOutletDetails((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCustomerCapacityChange = (value: string) => {
    // todo: update outlet state of store
    dispatch(setOutletData2({ ...outlet, customerCapacity: value }));
  };

  // handle days change
  const handleDaysOpenChange = (selectedDays: string[]) => {
    setOutletDetails({ ...outletDetails, days_open: selectedDays });
  };

  // uploading images
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const url = AWS_IMAGE_UPLOAD_URL;
    const bucket_name = OUTLET_BUCKET_NAME;

    if (files) {
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        setLoadingStates((prev) => ({ ...prev, uploadingImages: true }));
        try {
          // Upload each file
          const uploadImage = await uploadImageToBucket({
            file,
            bucket_name,
            url,
            maxFileSize: 2 * 1024 * 1024, // Optional: file size limit of 2 MB
          });
          console.log("uploadImage", uploadImage);
          setOutletDetails((prev: any) => ({
            ...prev,
            images: Array.isArray(prev.images)
              ? [...prev.images, uploadImage.fileKey]
              : [uploadImage.fileKey],
          }));
          if (uploadImage && uploadImage.fileKey) {
            const fileKey = uploadImage.fileKey;

            // Retrieve the uploaded file's URL (optional)
            const fileData = await getImageURlByFileKey(
              fileKey,
              bucket_name,
              `${LAMBDA_URL}/upload/url`
            );

            const imageUrl = fileData.fileUrl;
            console.log("Image URL:", imageUrl);

            // Dispatch the fileKey to the Redux store
            setImages((prev: any) => ({
              ...prev,
              images: [...prev.images, imageUrl],
            }));
            toast({
              duration: 5000,
              variant: "success",
              title: "Success",
              description: "Image uploaded successfully.",
            });

            // Optionally update local state for preview or other purposes
          }
        } catch (error) {
          toast({
            duration: 5000,
            variant: "destructive",
            title: "Failed to upload image. Please try again.",
            description: "Error: " + error,
          });
          console.error("Error uploading image:", error);
        }
      }

      // handleLoadingState("uploadingImages", false);
      setLoadingStates((prev) => ({ ...prev, uploadingImages: false }));
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
        "advayu-onboard-assets/outlet-assets",
        `${LAMBDA_URL}/upload/file`
      );

      console.log("Delete response:", deleteImageResponse);

      // Dispatch an action to remove the image from the Redux state
      // setImages((prevImages) => prevImages.filter((_, i) => i !== index));
      setOutletDetails((prev: any) => ({
        ...prev,
        images: prev.images.filter((image: string, i: number) => i !== index),
      }));

      console.log("Image deleted successfully. File Key:", fileKey);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  // handle get geo location
  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setOutletDetails({
            ...outlet,
            latitude: latitude,
            longitude: longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSave = async () => {
    setLoadingStates({ ...loadingStates, savingData: true });
    console.log("handleSave called");
    // Ensure `outlet` is defined before proceeding
    if (!outletDetails) {
      console.log("No outlet");
      return;
    }

    console.log("outletDetails before save:", outletDetails);
    const newErrors = validateFields(); // Assuming validateFields is implemented
    console.log("newErros", newErrors);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setLoadingStates({ ...loadingStates, savingData: false });
      return;
    }

    try {
      const { location, ...outletData } = outletDetails; // Destructure and remove location field
      // console.log("outletdata in save", outletData);

      const response = await patchOutletData(outletDetails, String(outletId));
      console.log("response after save", response);

      if (response === 200) {
        setLoadingStates({ ...loadingStates, savingData: false });
        toast({
          title: "Outlet updated successfully",
          variant: "success",
          duration: 5000,
        });
        router.push("/store");
      }
    } catch (error) {
      toast({
        title: "Error updating outlet",
        variant: "destructive",
        duration: 5000,
      });
      setLoadingStates({ ...loadingStates, savingData: false });
      console.error("Error saving outlet:", error);
    }
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

  const handleBackClick = () => {
    console.log("handleBackClick executed");

    history.back();
  };

  const handleCheckboxChange = (feature: any) => {
    const updatedValue = !outletDetails.accessibility_features[feature];
    setOutletDetails((prev: any) => ({
      ...prev,
      accessibility_features: {
        ...prev.accessibility_features,
        [feature]: updatedValue,
      },
    }));
  };

  const handleServiceAdd = () => {
    // console.log("current service", outletDetails.service);

    // Validate the service before adding
    if (!outletDetails.service) {
      console.warn("Service cannot be empty.");
      return;
    }

    if (outletDetails.services.includes(outletDetails.service)) {
      console.warn("Service already exists.");
      return;
    }

    // Add the `service` to `services` and clear `service` in a single dispatch
    const updatedServices = [...outletDetails.services, outletDetails.service];

    setOutletDetails({
      ...outletDetails,
      services: updatedServices,
      service: "", // Clear the temporary service field
    });

    console.log("Updated services:", updatedServices);
  };

  const handleRemoveService = (indexToRemove: number) => {
    console.log("Index to remove:", indexToRemove);

    // Validate if the index is within bounds
    if (indexToRemove < 0 || indexToRemove >= outletDetails.services.length) {
      console.warn("Invalid index. No service removed.");
      return;
    }

    // Filter out the service at the specified index
    const updatedServices = outletDetails.services.filter(
      (_: any, index: number) => index !== indexToRemove
    );

    // Update the state with the new services array
    dispatch(
      setCurrentOutlet({
        ...outletDetails,
        services: updatedServices,
      })
    );

    console.log("Updated services after removal:", updatedServices);
  };

  const handleAddAmenity = () => {
    // console.log("Current amenity:", outletDetails.amenity);
    // console.log("Current amenities:", outletDetails.amenities);

    // Ensure the `amenity` is non-empty before adding it to the list
    if (outletDetails.amenity.trim() === "") {
      console.log("Amenity cannot be empty.");
      return;
    }

    // Update the `amenities` array and clear the `amenity` field in a single dispatch

    setOutletDetails({
      ...outletDetails,
      amenities: [...outletDetails.amenities, outletDetails.amenity],
      amenity: "", // Clear the `amenity` field
    });

    // console.log("Updated amenities:", [
    //   ...outletDetails.amenities,
    //   outletDetails.amenity,
    // ]);
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    // console.log("Index to remove:", indexToRemove);

    // Validate if the index is within bounds
    if (indexToRemove < 0 || indexToRemove >= outletDetails.amenities.length) {
      console.warn("Invalid index. No amenity removed.");
      return;
    }

    // Filter out the amenity at the specified index
    const updatedAmenities = outletDetails.amenities.filter(
      (_: any, index: number) => index !== indexToRemove
    );

    // Update the state with the new amenities array

    setOutletDetails({
      ...outletDetails,
      amenities: updatedAmenities,
    });

    // console.log("Updated amenities after removal:", updatedAmenities);
  };

  return (
    <>
      <div className="grid grid-cols-1 w-[100%]">
        <div className="flex justify-between my-10 md:mx-8 mx-5 items-center">
          <div className="flex items-center">
            <button className="flex  items-center" onClick={handleBackClick}>
              <ChevronLeft />
              <h1 className="md:text-3xl	font-black"> Edit Outlet</h1>
            </button>
          </div>
          <div className=" md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
            <h3 className="md:text-xl text-xs">support@advayu.club</h3>
            <h3 className="md:text-xl text-xs">+91 9123456789</h3>
          </div>
          <Image className="md:hidden block" src={Support} alt="support" />
        </div>

        <div className="flex md:flex-row flex-col min-h-screen md:ml-10 ml-5 justify-center items-center">
          {loadingStates.fetchingData ? (
            <div>
              <Loading />
            </div>
          ) : (
            <div className="w-full md:max-w-2xl  px-4">
              <h1 className="text-2xl md:text-4xl font-bold">Edit Outlet</h1>
              <p className="mt-2 text-sm md:text-base">
                Name, store, and address
              </p>

              <div className="mt-8">
                {/* Outlet Name */}
                <div className="my-3">
                  <Label
                    className="text-base md:text-lg font-bold"
                    htmlFor="name"
                  >
                    Name of the outlet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter outlet name"
                    value={outletDetails?.name}
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
                    htmlFor="address"
                  >
                    Address of the outlet
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    className="mt-1 w-full"
                    type="text"
                    placeholder="Enter the outlet address"
                    value={outletDetails?.address}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Locate on Map */}
                {/* <div className="my-4">
                  <Label
                    className="text-base md:text-lg font-bold"
                    htmlFor="location">
                    Locate on the map
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="location"
                      className="pr-10 w-full my-2"
                      placeholder="Locate on the map"
                      value={
                        outletDetails?.latitude && outletDetails?.longitude
                          ? `Latitude: ${outletDetails?.latitude}, Longitude: ${outletDetails?.longitude}`
                          : "No location selected"
                      }
                      readOnly
                    />
                    <LocateFixed
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={handleLocationClick}
                    />
                  </div>
                  <Map
                    lat={outletDetails?.latitude || 12.9774047}
                    long={outletDetails?.longitude || 77.5742339}
                    onLocationChange={handleLocationClick}
                  />

       
                </div> */}
                {/* neighborhood */}
                <div className="my-3">
                  <Label
                    className="text-base md:text-lg font-bold"
                    htmlFor="neighborhood"
                  >
                    Neighborhood
                  </Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    className="mt-1 w-full"
                    type="text"
                    placeholder="Enter the  neighbor of outlet address"
                    value={outletDetails?.neighborhood}
                    onChange={handleInputChange}
                  />
                </div>
                {/* street */}
                <div className="my-3">
                  <Label
                    className="text-base md:text-lg font-bold"
                    htmlFor="street"
                  >
                    Street
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    className="mt-1 w-full"
                    type="text"
                    placeholder="Enter street"
                    value={outletDetails?.street}
                    onChange={handleInputChange}
                  />
                </div>
                {/* postal code */}
                <div className="my-3">
                  <Label
                    className="text-base md:text-lg font-bold"
                    htmlFor="postal_code"
                  >
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
                    value={outletDetails?.postal_code}
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
                      htmlFor="phoneNumber"
                    >
                      Manager mobile number
                    </Label>

                    <PhoneNumberInput
                      value={outletDetails?.manager_phone?.replace("+91", "")}
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
                    htmlFor="manager_name"
                  >
                    Manager name
                  </Label>
                  <Input
                    id="manager_name"
                    name="manager_name"
                    className="mt-1 w-full"
                    type="text"
                    placeholder="Enter outlet manager name"
                    value={outletDetails?.manager_name}
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
                  value={outletDetails.services}
                  onChange={handleInputChange}
                />
              </div> */}
                {/* list of services */}

                <div className="my-3">
                  <h3 className="text-base md:text-lg font-bold">
                    Add services
                  </h3>
                  <div className="relative flex items-center  my-1">
                    <Input
                      id="service"
                      name="service"
                      type="text"
                      placeholder="Enter service"
                      value={outletDetails?.service}
                      onChange={handleInputChange}
                      className="border border-black rounded p-2 pr-20 w-full"
                    />
                    <button
                      onClick={handleServiceAdd}
                      className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r"
                    >
                      Add
                    </button>
                  </div>
                  {errors.socialUrl && (
                    <span className="text-red-500">{errors.socialUrl}</span>
                  )}

                  {/* Preview services */}
                  {outletDetails?.services.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {outletDetails?.services.map(
                        (link: string, index: number) => (
                          <div
                            key={index}
                            className="relative flex items-center max-w-sm"
                          >
                            <span className=" px-2 py-1 border border-black w-full overflow-auto rounded">
                              {link}
                            </span>
                            <button
                              onClick={() => handleRemoveService(index)}
                              className="absolute right-0 bg-[#0000004D] rounded-full transform translate-x-[43%] -translate-y-[97%]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
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
                  value={outletDetails.amenities}
                  onChange={handleInputChange}
                />
              </div> */}

                {/* list of ammenitites */}

                <div className="my-3">
                  <h3 className="text-base md:text-lg font-bold">
                    Add ammenities
                  </h3>
                  <div className="relative flex items-center  my-1">
                    <Input
                      id="amenity"
                      name="amenity"
                      type="text"
                      placeholder="Enter amenity"
                      value={outletDetails?.amenity}
                      onChange={handleInputChange}
                      className="border border-black rounded p-2 pr-20 w-full"
                    />
                    <button
                      onClick={handleAddAmenity}
                      className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r"
                    >
                      Add
                    </button>
                  </div>

                  {/* Preview ammenities */}
                  {outletDetails?.amenities.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {outletDetails?.amenities.map(
                        (link: string, index: number) => (
                          <div
                            key={index}
                            className="relative flex items-center max-w-sm"
                          >
                            <span className=" px-2 py-1 border border-black w-full overflow-auto rounded">
                              {link}
                            </span>
                            <button
                              onClick={() => handleRemoveAmenity(index)}
                              className="absolute right-0 bg-[#0000004D] rounded-full transform translate-x-[43%] -translate-y-[97%]"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-black"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
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
                  <h2 className="text-xl font-semibold">
                    Accessibility Features
                  </h2>

                  <div className="mt-2">
                    {outletDetails?.accessibility_features &&
                      Object.entries(outletDetails.accessibility_features).map(
                        ([feature, value]) => {
                          // Type assertion to ensure `feature` is a valid key
                          const featureKey = feature as any;
                          // console.log(featureKey, value);

                          return (
                            <div
                              key={feature}
                              className="flex items-center space-x-4 my-2"
                            >
                              <Checkbox
                                checked={value as boolean}
                                onCheckedChange={() =>
                                  handleCheckboxChange(featureKey)
                                }
                                aria-checked={value ? "true" : "false"} // aria-checked for accessibility
                                className=""
                              />
                              <label className="capitalize">
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
                        className="mt-1  p-2 border rounded"
                        value={outletDetails?.opening_time || ""} // Use value for controlled component
                        onChange={handleInputChange}
                      >
                        <option value="">Opening Time</option>

                        {times.map((time) => (
                          <option key={`open-${time}`} value={`${time}:00 AM`}>
                            {time}:00 AM
                          </option>
                        ))}
                        {times.map((time) => (
                          <option
                            key={`open-${time}-pm`}
                            value={`${time}:00 PM`}
                          >
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
                        className="mt-1  p-2 border rounded"
                        value={outletDetails?.closing_time}
                        onChange={handleInputChange}
                      >
                        <option value="">Closing Time</option>
                        {times.map((time) => (
                          <option key={`close-${time}`} value={`${time}:00 AM`}>
                            {time}:00 AM
                          </option>
                        ))}
                        {times.map((time) => (
                          <option
                            key={`close-${time}-pm`}
                            value={`${time}:00 PM`}
                          >
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

                  <ToggleGroup
                    type="multiple"
                    className="mt-2 flex flex-wrap gap-2"
                    value={outletDetails?.days_open || []}
                    onValueChange={handleDaysOpenChange}
                  >
                    {daysOfWeek.map(({ display, value }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {display}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                {/* customer capacity */}
                {/* <div>
                <p className="font-bold">Customer capacity</p>
                <RadioGroup
                  value={outletDetails.customerCapacity}
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
                      isChecked={outletDetails.methodsOfPayment.includes(method)}
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
                    disabled={loadingStates?.uploadingImages}
                  />

                  <label
                    aria-disabled={!loadingStates.uploadingImages}
                    htmlFor="fileInput"
                    className="border border-black text-black px-4 rounded cursor-pointer my-1 w-fit"
                  >
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
                  {images &&
                    images.images.map((src: string, index: number) => (
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
                          className="absolute right-0 top-0 bg-[#0000004D] rounded-full transform translate-x-1/2 -translate-y-1/2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-black"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
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
                    disabled={loadingStates.savingData}
                    className="w-28"
                    size="thin"
                    onClick={handleSave}
                  >
                    {loadingStates.savingData ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
