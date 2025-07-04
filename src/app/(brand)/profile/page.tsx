"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import { useForm } from "react-hook-form";
import { useGetBrandUser } from "@/hooks/use-brand-user";
import Loading from "@/components/loading";

function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const brandUser = useSelector((state: RootState) => state.brandUser);
  const { data: fetchedUser, isLoading } = useGetBrandUser(brandUser.id);

  useEffect(() => {
    console.log("fetchedUser", fetchedUser);
    if (fetchedUser) {
      reset({
        name: fetchedUser.name,
        email: fetchedUser.email,
        phone: fetchedUser.phone,
        password: "",
        confirmPassword: "",
      });
    }
  }, [fetchedUser, reset]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="md:w-[40%] w-full px-10 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
      <form onSubmit={handleSubmit}>
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

        {/* Email Field */}
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            {...register("email", { required: true })}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        {/* Phone Field */}
        <div className="mb-4">
          <Label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700">
            Phone
          </Label>
          <Input
            {...register("phone", { required: true })}
            type="tel"
            id="phone"
            placeholder="Enter your phone with country code"
            className="w-full px-3 py-2 mt-1 border rounded-md"
            minLength={12}
            maxLength={12}
            required
          />
        </div>
        {fetchedUser?.provider !== "GOOGLE" && (
          <>
            <div className="mb-4">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                New Password
              </Label>
              <Input
                {...register("password", { required: true })}
                type="password"
                id="password"
                placeholder="Enter your new password"
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
            <div className="mb-4">
              <Label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <Input
                {...register("confirmPassword", { required: true })}
                type="password"
                id="confirmPassword"
                placeholder="Enter your new password"
                className="w-full px-3 py-2 mt-1 border rounded-md"
              />
            </div>
          </>
        )}

        <div className="flex justify-between items-center">
          <Button type="submit" className=" text-white px-4 py-2 rounded-md ">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Page;
