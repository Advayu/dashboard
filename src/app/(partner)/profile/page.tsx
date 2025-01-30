"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { putBrandUser } from "@/services/api/brands/brandApi";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";
import { BrandUser } from "@/Types/type";

function Page() {
  const dispatch = useDispatch();
  const brandUser = useSelector((state: RootState) => state.brandUser);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: brandUser.name,
    email: brandUser.email,
    phone: brandUser.phone,
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password does not match",
        description: "Please try again later.",
        duration: 7000,
      });
      return;
    }

    try {
      setIsLoading(true);
      const { confirmPassword, ...formDataWithoutPassword } = formData;
      const saveData = await putBrandUser(
        formDataWithoutPassword,
        brandUser.id
      );
      dispatch(setBrandUser(saveData as BrandUser));
      console.log("saveData", saveData);
      toast({
        variant: "success",
        title: "Profile updated successfully",
      });
      router.replace("/");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      // Optionally, check if it's an instance of Error before logging
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: error.message || "Please try again later.",
        });
      }
    } finally {
      setIsLoading(false); // This ensures loading state is always cleared
    }
  };
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
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            type="tel"
            id="phone"
            name="phone"
            placeholder="Enter your phone with country code"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-md"
            minLength={12}
            maxLength={12}
            required
          />
        </div>

        {/* Reset Password */}
        <div className="mb-4">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700">
            New Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your new password"
            value={formData.password}
            onChange={handleChange}
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
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Enter your new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-md"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button type="submit" className=" text-white px-4 py-2 rounded-md ">
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Page;
