"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import Loading from "@/components/loading";
import axios from "axios";
import { ChevronLeft, UserRound } from "lucide-react";
import Image from "next/image";
import {
  AWS_IMAGE_UPLOAD_URL,
  LAMBDA_URL,
  OUTLET_BUCKET_NAME,
  URLREGEX,
} from "@/utils/constants";
import { navigateToPreviousPage } from "@/functions/function";
import { brandDetailsSchema } from "@/schemas/brands/onboarding/validation";
import { useRouter } from "next/navigation";
import {
  getImageURlByFileKey,
  uploadImageToBucket,
} from "@/services/ImageService";
import { set } from "date-fns";
import { toast } from "@/hooks/use-toast";
import {
  deleteImageFromBucket,
  getFileFromBucket,
} from "@/services/ImageService";
import { useDispatch } from "react-redux";
import { setBrandData } from "@/store/globalSlice/brandSlice";

const BrandDetails: React.FC<any> = () => {
  const dispatch = useDispatch();
  const [brandDetails, setBrandDetails] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [socialUrl, setSocialUrl] = useState<string>("");
  const [logo, setLogo] = useState<string | null>(null);
  const router = useRouter();
  const [logoImage, setLogoImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getBrandDetails = async () => {
      if (typeof window === "undefined") return;

      const urlParams = new URLSearchParams(window.location.search);
      const brandId = urlParams.get("brand_id");

      setBrandId(brandId);

      if (!brandId) {
        console.error("Brand ID is missing from the query string.");
        return;
      }

      try {
        const response = await axios.get(`${LAMBDA_URL}/v1/brands/${brandId}`, {
          withCredentials: true,
        });
        console.log("edit brand response", response.data);

        const logoImageUrl = await getImageURlByFileKey(
          response.data.logo_url,
          OUTLET_BUCKET_NAME,
          `${LAMBDA_URL}/upload/url`
        );

        console.log("logoImageUrl", logoImageUrl.fileUrl);
        setLogoImage(logoImageUrl.fileUrl);

        const bannerImageUrl = await getImageURlByFileKey(
          response.data.banner_url,
          OUTLET_BUCKET_NAME,
          `${LAMBDA_URL}/upload/url`
        );
        console.log("bannerImageUrl", bannerImageUrl.fileUrl);
        setBannerImage(bannerImageUrl.fileUrl);

        setBrandDetails(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to get brand details",
        });
        router.push("/");

        console.error("Error fetching brand details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getBrandDetails();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBrandDetails((prev: any) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRemoveSocialLinks = (index: number) => {
    setBrandDetails((prev: any) => ({
      ...prev,
      social_links: prev.social_links.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  const handleSocialLinkUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setSocialUrl(e.target.value);
  };

  const handleSocialLinkUrlUpload = () => {
    if (socialUrl.match(URLREGEX)) {
      setBrandDetails((prev: any) => ({
        ...prev,
        social_links: [...prev.social_links, socialUrl],
      }));
      setSocialUrl("");
    } else {
      setErrors((prev) => ({
        ...prev,
        socialUrl: "Invalid URL",
      }));
    }
  };

  const handleSave = useCallback(async () => {
    console.log("brandDetails", brandDetails);
    // const validationErrors = brandDetailsSchema.safeParse(brandDetails);
    // if (!validationErrors.success) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: validationErrors.error.message,
    //   });
    //   return;
    // }
    try {
      setLoading(true);
      const response = await axios.put(
        `${LAMBDA_URL}/v1/brands/${brandId}`,
        brandDetails,
        { withCredentials: true }
      );
      if (response.status === 200) {
        dispatch(setBrandData(response.data));
        toast({
          variant: "success",
          title: "Success",
          description: "Brand updated successfully",
        });
        setLoading(false);

        router.push("/");
      }
      console.log("Brand saved successfully:", response.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save brand",
      });
      setLoading(false);
      console.error("Error saving brand:", error);
    }
  }, [brandDetails, brandId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("clicked", e.target.name);
    const name = e.target.name;
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected.",
      });
      return;
    }

    try {
      const url = AWS_IMAGE_UPLOAD_URL;
      const bucket_name = OUTLET_BUCKET_NAME;
      // Upload the file using the function
      const response = await uploadImageToBucket({
        file,
        bucket_name,
        url,
        maxFileSize: 2 * 1024 * 1024,
      }); // 2 MB limit

      const fileKey = response.fileKey;
      const fileData = await getFileFromBucket(
        fileKey,
        bucket_name,
        `${LAMBDA_URL}/upload/url`
      );

      const imageUrl = fileData.fileUrl;
      console.log("imageUrl", imageUrl);

      // Update the state based on which image is being uploaded
      if (name === "logo_url") {
        setLogoImage(imageUrl);
        setBrandDetails((prev: any) => ({
          ...prev, // Spread the existing data
          logo_url: fileKey, // Update only the logo_url field
        }));
      }

      if (name === "banner_url") {
        setBannerImage(imageUrl);
        setBrandDetails((prev: any) => ({
          ...prev, // Spread the existing data
          banner_url: fileKey, // Update only the banner_url field
        }));
      }

      toast({
        variant: "default",
        title: "Success",
        description: "Image uploaded successfully.",
      });

      // Reset the file input
      e.target.value = "";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image upload failed.",
      });
    }
  };

  const removeImage = async (Image: string, reduxVariable: string) => {
    if (!Image) return;

    try {
      // Parse the logoImage URL to extract the fileKey
      const url = new URL(Image); // Create a URL object
      const fileKey = url.pathname.split("/").slice(-1)[0]; // Extract the file key

      const deleteImageResponse = await deleteImageFromBucket(
        fileKey,
        "advayu-onboarding-assets/outlet-assets",
        `${LAMBDA_URL}/upload/file`
      );

      if (reduxVariable === "logo_url") {
        setBrandDetails({ [reduxVariable]: "" });
        setLogoImage("");
      }

      if (reduxVariable === "banner_url") {
        setBrandDetails({ [reduxVariable]: "" });
        setBannerImage("");
      }

      setBrandDetails({ [reduxVariable]: "" });
      console.log("delete", deleteImageResponse);
      console.log("File Key:", fileKey);

      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };
  // advayu-onboarding-assets/outlet-assets
  return (
    <div className="w-full">
      <div className="flex justify-between my-10 md:mx-8 mx-5 items-center">
        <div className="flex items-center">
          <button
            className="flex items-center"
            onClick={navigateToPreviousPage}>
            <ChevronLeft />
            <h1 className="md:text-3xl font-black"> Edit Brand</h1>
          </button>
        </div>
        <div className="flex flex-col md:flex-row space-x-4 mx-2 items-center">
          <h3 className="md:text-xl text-xs">support@advayu.club</h3>
          <h3 className="md:text-xl text-xs">+91 9660657811</h3>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-screen w-full">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full md:px-0 px-5">
          <div>
            <h1 className="text-4xl font-bold">Brand Details</h1>
            <p>Enter your brand details</p>
            {/* Brand Name */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="name">
                What is your brand name? <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                id="name"
                name="name"
                className={`${errors.name ? "border border-red-500" : ""}`}
                placeholder="Enter your brand name"
                defaultValue={brandDetails?.name}
                onChange={handleInputChange}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>

            {/* Industry and Category */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="category_name">
                Select your industry <span className="text-red-500">*</span>
              </Label>
              <div className="flex space-x-2">
                <div>
                  <select
                    id="category_name"
                    name="category_name"
                    defaultValue={brandDetails?.category_name}
                    onChange={handleInputChange}
                    className={`w-full py-1 px-3 border border-black rounded-md ${
                      errors.category_name ? "border-red-500" : ""
                    }`}>
                    <option value="" disabled>
                      Select an industry
                    </option>
                    <option value={brandDetails?.category_name}>
                      {brandDetails?.category_name}
                    </option>
                    <option value="fashion">Fashion</option>
                    <option value="technology">Technology</option>
                    <option value="home">Home</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="accessories">Accessories</option>
                  </select>
                  {errors.category_name && (
                    <p className="text-red-500">{errors.category_name}</p>
                  )}
                </div>

                <div>
                  <select
                    id="category"
                    name="subcategories"
                    defaultChecked={brandDetails?.category}
                    onChange={handleInputChange}
                    className="w-full py-1 px-3 border border-black rounded-md">
                    <option value="" disabled>
                      Select a category
                    </option>
                    {brandDetails?.category_name === "fashion" && (
                      <>
                        <option value="clothing">Clothing</option>
                        <option value="footwear">Footwear</option>
                      </>
                    )}
                  </select>
                  {errors.category && (
                    <p className="text-red-500">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Age Group Selection */}
            {/* <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="ageGroup">
                What is your brand’s targeted age group?
              </Label>
              <div id="ageGroup" className="space-y-2">
                {["0-12", "13-18", "19-25", "26-40", "41-60", "60+"].map(
                  (group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        name={`ageGroup-${group}`}
                        className="rounded-full"
                        id={`ageGroup-${group}`}
                        checked={brandDetails?.ageGroup?.includes(group)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setBrandDetails((prev: any) => ({
                              ...prev,
                              ageGroup: [...prev.ageGroup, group],
                            }));
                          } else {
                            setBrandDetails((prev: any) => ({
                              ...prev,
                              ageGroup: prev.ageGroup.filter(
                                (g: string) => g !== group
                              ),
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`ageGroup-${group}`}>{group}</Label>
                    </div>
                  )
                )}
              </div>
            </div> */}

            {/* Description */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="description">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                name="description"
                placeholder="Enter your description"
                defaultValue={brandDetails?.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Phone number */}
            {/* <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-xl font-bold" htmlFor="phone">
                Phone number
              </Label>
              <PhoneNumberInput
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                defaultValue={brandDetails?.phone}
                onChange={handleInputChange}
              />
            </div> */}

            {/* Alternate phone */}
            {/* <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-xl font-bold" htmlFor="alternate_phone">
                Alternate number
              </Label>
              <PhoneNumberInput
                id="alternate_phone"
                name="alternate_phone"
                placeholder="Enter your alternate number"
                defaultValue={brandDetails?.alternate_phone}
                onChange={handleInputChange}
              />
              {errors.alternateNumber && (
                <p className="text-red-500">{errors.alternateNumber}</p>
              )}
            </div> */}

            {/* Email */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="email">
                Email address
              </Label>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
                defaultValue={brandDetails?.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>

            {/* Logo Upload Section */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload the primary logo
              </h3>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo_url"
                    name="logo_url"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="logo_url"
                    className="border border-black text-black px-4 rounded cursor-pointer my-1">
                    Attach image
                  </label>
                </div>
                {logoImage && (
                  <div className="mt-4 relative">
                    <Image
                      width={100}
                      height={100}
                      src={logoImage}
                      alt="Image Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(logoImage, "logo_url")}
                      className="absolute top-0 right-0 bg-[#0000004D] rounded-full transform translate-x-1/2 -translate-y-1/2">
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
                )}
              </div>
            </div>

            {/* Banner URL */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload banner image
              </h3>
              <div className="flex flex-col items-start">
                <div className="flex items-center">
                  <input
                    id="banner_url"
                    name="banner_url"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="banner_url"
                    className="border border-black text-black px-4 rounded cursor-pointer my-1">
                    Attach branch image
                  </label>
                </div>
                {bannerImage && (
                  <div className="mt-4 relative">
                    <Image
                      width={100}
                      height={100}
                      src={bannerImage}
                      alt="Image Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(bannerImage, "banner_url")}
                      className="absolute top-0 right-0 bg-[#0000004D] rounded-full transform translate-x-1/2 -translate-y-1/2">
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
                )}
              </div>
            </div>

            {/* Website Links */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload Website Links
              </h3>
              <div className="relative flex items-center max-w-sm my-2">
                <Input
                  type="text"
                  id="website_url"
                  name="website_url"
                  placeholder="Paste website link"
                  defaultValue={brandDetails?.website_url}
                  onChange={handleInputChange}
                  className="border border-black rounded p-2 pr-20 w-full"
                />
                {/* <input
                  id="website_url"
                  name="website_url"
                  type="text"
                  placeholder="Paste website link"
                  defaultValue={brandDetails?.website_url}
                  className="border border-black rounded p-2 pr-20 w-full"
                /> */}
                {/* <button className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
                  Add Link
                </button> */}
              </div>
              {errors.website_url && (
                <span className="text-red-500">{errors.website_url}</span>
              )}
            </div>

            {/* Social Links */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload Social Links
              </h3>
              <div className="relative flex items-center max-w-sm my-2">
                <input
                  id="social_links"
                  name="social_links"
                  type="text"
                  placeholder="Paste social link"
                  defaultValue={brandDetails?.socialUrl}
                  onChange={handleSocialLinkUrlChange}
                  className="border border-black rounded p-2 pr-20 w-full"
                />
                <button
                  onClick={handleSocialLinkUrlUpload}
                  className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
                  Add Link
                </button>
              </div>
              {errors.socialUrl && (
                <span className="text-red-500">{errors.socialUrl}</span>
              )}
              {brandDetails?.social_links &&
                Object.keys(brandDetails?.social_links).length > 0 && (
                  <div className="mt-2 space-y-2">
                    {Object.entries(brandDetails?.social_links).map(
                      ([platform, link], index) => (
                        <div
                          key={index}
                          className="relative flex items-center max-w-sm">
                          <span className="px-2 py-1 border border-black w-full overflow-auto rounded">
                            {String(link)}
                          </span>
                          <button
                            onClick={() => handleRemoveSocialLinks(index)}
                            className="absolute right-0 bg-[#0000004D] rounded-full transform translate-x-[45%] -translate-y-[94%]">
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

            <div className="flex space-x-3 my-8">
              <Button
                disabled={loading}
                className="w-28"
                size="thin"
                onClick={handleSave}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandDetails;
