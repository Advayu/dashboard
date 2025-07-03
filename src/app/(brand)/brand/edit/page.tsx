"use client";
import React, { useState, useEffect, useCallback, useRef, use } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/components/loading";
import { useGetBrand, useUpdateBrand } from "@/hooks/use-brand";
import { ChevronLeft } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { navigateToPreviousPage } from "@/functions/function";
import { FilePreview } from "@/components/FilePreview";
import ImageUploader from "@/components/ImageUploader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const BrandDetails: React.FC<any> = () => {
  const brand_user = useSelector((state: RootState) => state.brandUser);
  const method = useForm<any>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = method;
  const { mutate: updateBrand } = useUpdateBrand();

  /* Todo: remove hardcoded brand id*/
  const brand_id = brand_user?.brand_id;
  console.log("brand_id", brand_id);

  const onSubmit: SubmitHandler<any> = (data) => {
    updateBrand({ id: brand_id, data });
    console.log("data", data);
  };

  const { data: brandDetails } = useGetBrand(brand_id);

  useEffect(() => {
    if (brandDetails) {
      console.log("brandDetails", brandDetails);
      reset(brandDetails);
    }
  }, [brandDetails, reset]);

  console.log("brandDetails", brandDetails);

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center w-full md:px-0 px-5">
          <div>
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
                    <option value="option1">option1</option>
                    <option value="option2">option2</option>
                  </select>
                </div>

                <div>
                  <select
                    {...register("subcategories", { required: true })}
                    id="subcategories"
                    name="subcategories"
                    className={`w-full py-1 px-3 border rounded-md  "border-black"
                    }`}>
                    <option value="" disabled>
                      Select a category
                    </option>
                    <option value="option1">option1</option>
                    <option value="option2">option2</option>
                    <option value="option3">option3</option>
                  </select>
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
                {/* <div className="flex items-center">
                  <input
                    {...register("logo_url")}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo_url"
                    name="logo_url"
                  />
                  <label
                    htmlFor="logo_url"
                    className="border border-black text-black px-4 rounded cursor-pointer my-1">
                    Attach image
                  </label>
                </div> */}
                <ImageUploader name="logo_url" multiple={false} />
                {/* Todo:  */}
                {/* <FilePreview file={watch("logo_url")} width={100} height={100} /> */}
              </div>
            </div>

            {/* Banner URL */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload banner image
              </h3>
              <div className="flex flex-col items-start">
                {/* <div className="flex items-center">
                  <input
                    {...register("banner_url")}
                    id="banner_url"
                    name="banner_url"
                    type="file"
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="banner_url"
                    className="border border-black text-black px-4 rounded cursor-pointer my-1">
                    Attach branch image
                  </label>
                </div> */}

                <ImageUploader name="banner_url" multiple={false} />
              </div>
            </div>

            {/* Website Links */}
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload Website Links
              </h3>
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
            <div className="py-3">
              <h3 className="text-base md:text-lg font-bold">
                Upload Social Links
              </h3>
              <div className="relative flex items-center max-w-sm my-2">
                <input
                  {...register("social_links")}
                  id="social_links"
                  name="social_links"
                  type="text"
                  placeholder="Paste social link"
                  className="border border-black rounded p-2 pr-20 w-full"
                />
                <button
                  type="button"
                  className="px-4 bg-white border absolute right-0 top-0 h-full border-black border-l text-black rounded-r">
                  Add Link
                </button>
              </div>

              {/* {brandDetails?.social_links &&
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
                )} */}
            </div>

            <div className="flex space-x-3 my-8">
              <Button type="submit" className="w-28" size="thin">
                save
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BrandDetails;
