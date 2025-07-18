"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { useForm } from "react-hook-form";
import { useGetBrandUser, useUpdateBrandUser } from "@/hooks/use-brand-user";
import Loading from "@/components/loading";
import { ChevronLeft } from "lucide-react";
import { navigateToPreviousPage } from "@/functions/function";
import NumericInput from "@/components/ui/NumericInput";

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const brandUser = useSelector((state: RootState) => state.brandUser);
  const { data: fetchedUser, isLoading } = useGetBrandUser(brandUser.id);
  const { mutate: updateBrandUser, isPending } = useUpdateBrandUser(brandUser.id);

  useEffect(() => {
    console.log("fetchedUser", fetchedUser);
    if (fetchedUser) {
      reset({
        name: fetchedUser.name,
        email: fetchedUser.email,
        phone: fetchedUser.phone,
        role: fetchedUser.role,
      });
    }
  }, [fetchedUser, reset]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40"></div>
  }

  const onSubmit = (data: any) => {
    updateBrandUser(data);
  };

  return (
    <div className="md:w-[40%] w-full px-10 mt-10">
      <button onClick={navigateToPreviousPage} type="button" className="text-2xl font-semibold mb-4 inline-flex items-center cursor-pointer" ><ChevronLeft/> Profile Settings</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="mb-4">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            {...register("name", { required: true })}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">Name is required.</p>
        )}

        {/* Email Field */}
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            disabled
            type="email"
            id="email"
            {...register("email")}
            className="w-full px-3 py-2 mt-1 border rounded-md"
          />
        </div>
        {/* Phone Field */}
        <div className="mb-4">
          <Label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700">
            Phone
          </Label>
          <NumericInput
           register={{...register("phone")}} 
            type="tel"
            id="phone"
            placeholder="Enter your phone with country code"
            className="w-full px-3 py-2 mt-1 border rounded-md"
            minLength={12}
            maxLength={12}
          />
        </div>
        <div className="mb-4">
          <Label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700">
            Role
          </Label>
          <Input
            disabled
            {...register("role")}
            id="role"
            placeholder="your role"
            className="w-full px-3 py-2 mt-1 border rounded-md"
            minLength={12}
            maxLength={12}
          />
        </div>

        <div className="flex justify-between items-center">
          <Button disabled={isPending} type="submit" className=" text-white px-4 py-2 rounded-md " size={"lg"}>
          {isPending ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Page;
