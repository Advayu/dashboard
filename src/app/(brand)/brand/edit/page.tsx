"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetBrand, useUpdateBrand } from "@/hooks/use-brand";
import { ChevronLeft } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { navigateToPreviousPage } from "@/functions/function";
import ImageUploader from "@/components/ImageUploader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useImageUpload } from "@/hooks/use-image";
import { OUTLET_BUCKET_NAME } from "@/utils/constants";
import {
  useGetCategoriesByIndustry,
  useGetIndustries,
} from "@/hooks/use-industry";
import { DynamicInputList } from "@/components/DynamicInputList";
import { resolveImageUpload } from "@/utils/image-utils";
import { sanitizeBrandDetails } from "@/utils/brand-utils";
import { useRouter } from "next/navigation";

const BrandDetails: React.FC<any> = () => {
  const router = useRouter();
  // getting brand user details form redux store
  const [globalLoading, setGlobalLoading] = useState(false);
  const brand_user = useSelector((state: RootState) => state.brandUser);
  const brand_id = brand_user?.brand_id;
  // react form hook
  const method = useForm<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues
  } = method;

  // update brand user details
  const { mutate: updateBrand, isSuccess: isUpdateSuccess, isPending: isUpdating, error: updateError } = useUpdateBrand();

  // upload image and receive fileKey
  const imageUploadMutation = useImageUpload(OUTLET_BUCKET_NAME);

  const {
    data: industries,
    isLoading: industryLoading,
    error: industryError,
  } = useGetIndustries();

  const {
    data: categories,
    isLoading: categoryLoading,
    error: categoryError,
  } = useGetCategoriesByIndustry(watch("category_name"));

  /* Todo: remove hardcoded brand id*/

  const onSubmit: SubmitHandler<any> = async (brand) => {
    const logoInput = brand.logo_url?.[0];
    const bannerInput = brand.banner_url?.[0];

    console.log("logoInput", logoInput);
    console.log("bannerInput", bannerInput);

    const [logoKey, bannerKey] = await Promise.all([
      resolveImageUpload(logoInput, imageUploadMutation.mutateAsync),
      resolveImageUpload(bannerInput, imageUploadMutation.mutateAsync),
    ]);

    // Assign processed fileKeys back
    brand.logo_url = logoKey;
    brand.banner_url = bannerKey;

    updateBrand({ id: brand_id, data: brand });

    if (isUpdateSuccess) {
      router.push("/");
    }
  };

  const { data: brandDetails } = useGetBrand(brand_id);

  useEffect(() => {
    if (!industryLoading || !categoryLoading) {
      if (brandDetails) {
        const formattedDetails = {
          ...brandDetails,
          logo_url: typeof brandDetails.logo_url === "string" && brandDetails.logo_url !== "" ? [brandDetails.logo_url] : [],
          banner_url: typeof brandDetails.banner_url === "string" && brandDetails.banner_url !== "" ? [brandDetails.banner_url] : [],
        };
        reset(formattedDetails);
      }
    }
  }, [brandDetails, reset, categoryLoading, industryLoading]);

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
      <FormProvider {...method}>
        {globalLoading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center w-full md:px-0 px-5 ">
          <div className="border border-gray-400/70 rounded-lg p-4 shadow-lg md:w-[40vw] w-aut0">
            <h1 className="text-4xl font-bold">Brand Details</h1>
            <p>Enter your brand details</p>

            {/* Brand Name */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="name">
                What is your brand name? <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name", { required: true })}
                type="text"
                id="name"
                name="name"
                placeholder="Enter your brand name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs">This field is required</p>
              )}
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
                    {...register("category_name", { required: true })}
                    id="category_name"
                    name="category_name"
                    className={`w-full py-1 px-3 border rounded-md 
               "border-black"
                    }`}>
                    <option value="" disabled>
                      Select an industry
                    </option>
                    {industryLoading ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : industries?.length === 0 ? (
                      <option value="" disabled>
                        No industry found
                      </option>
                    ) : (
                      industries?.map((item: any, index: number) => (
                        <option value={item.name} key={index}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.category_name && (
                    <p className="text-red-500 text-xs">
                      This field is required
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register("subcategories", { required: true })}
                    id="subcategories"
                    name="subcategories"
                    className={`w-full py-1 px-3 border rounded-md  "border-black"
                    }`}>
                    <option value="Select a category" disabled>
                      Select a category
                    </option>
                    {categoryLoading ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : categories?.length === 0 ? (
                      <option value="" disabled>
                        No category found
                      </option>
                    ) : (
                      categories?.map((item: any, index: number) => (
                        <option value={item.name} key={index}>
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.subcategories && (
                    <p className="text-red-500 text-xs">
                      This field is required
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label
                className="text-base md:text-lg font-bold"
                htmlFor="description">
                Description
              </Label>
              <Input
                {...register("description")}
                type="text"
                id="description"
                name="description"
                placeholder="Enter your description"
              />
            </div>

            {/* Email */}
            <div className="grid w-full max-w-sm items-center gap-1.5 py-3">
              <Label className="text-base md:text-lg font-bold" htmlFor="email">
                Email address
              </Label>
              <Input
                {...register("email")}
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
              />
            </div>

            {/* Logo Upload Section */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload the primary logo
              </h3>
              <div className="flex flex-col items-start">
                <ImageUploader name="logo_url" multiple={false} />
              </div>
            </div>
            {/* Banner URL */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload banner image
              </h3>
              <div className="flex flex-col items-start">
                <ImageUploader name="banner_url" multiple={false} />
              </div>
            </div>

            {/* Website Links */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">Website Link</h3>
              <div className="relative flex items-center max-w-sm my-2">
                <Input
                  {...register("website_url")}
                  type="text"
                  id="website_url"
                  name="website_url"
                  placeholder="Paste website link"
                  className="border border-black rounded p-2 pr-20 w-full"
                />
              </div>
            </div>

            {/* Social Links */}

            <DynamicInputList
              fieldName={`social_links`}
              label="Add social links"
              placeholder="enter social link"
              index={2}
            />

            <div className="flex space-x-3 my-8">
              <Button type="submit" className="w-28" size="thin" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BrandDetails;
