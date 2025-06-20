"use client";

import { toast } from "@/hooks/use-toast";
import { LAMBDA_URL } from "@/utils/constants";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";
import { setBrandData } from "@/store/globalSlice/brandSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const LoginWithGoogle: React.FC = () => {
  const [brandName, setBrandName] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const handleSuccess = async (credentialResponse: any) => {
    console.log("🟢 Google login success:", credentialResponse);

    const idToken = credentialResponse.credential;
    console.log("🪪 ID Token:", idToken);

    try {
      const res = await axios.post(
        `http://localhost:4200/brand-users/dashboard-brand-google-login`,
        {
          idToken: idToken,
        },
        { withCredentials: true }
      );

      const data = await res.data;
      console.log("✅ Login success response:", data);
      console.log("User data:", data);
      toast({
        variant: "success",
        title: "Login successful",
      });
      if (res.data?.user.brand_id) {
        localStorage.setItem("brandId", res.data.user.brand_id);
      }

      // Show success toast
      toast({
        variant: "success",
        title: "Login successful",
      });

      console.log("logged in user", res.data);
      // Fetch brand details
      const brandUser = await getBrandByEmail(res.data.user.email);
      const brandDetail = await getBrandDetails(brandUser?.brand_id || "");

      if (brandUser) {
        // Handle brand details if fetched
        dispatch(setBrandUser(brandUser));
        setBrandName(brandUser.name);
      }
      if (brandDetail) {
        console.log("brandDetail", brandDetail);
        dispatch(setBrandData(brandDetail));
      }

      router.replace(`/`);
      // // Optional: store token, redirect, etc.
      // localStorage.setItem("token", data.jwt);
    } catch (error) {
      console.error("❌ Error sending token to backend:", error);
    }
  };

  const getBrandByEmail = async (email: string) => {
    try {
      const response = await axios.get(`${LAMBDA_URL}/brand-users`, {
        withCredentials: true,
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        const brand = response.data.find((item: any) => item.email === email);
        if (brand) {
          localStorage.setItem("brandId", brand.brand_id);
          localStorage.setItem("brandName", brand.name);

          console.log("Fetched brand details:", brand);
          return brand;
        }
      }

      console.warn("No brand found for the given email.");
      return null;
    } catch (error) {
      console.error("Error fetching brand details:", error);
      return null;
    }
  };

  const getBrandDetails = async (id: string) => {
    try {
      const response = await axios.get(`${LAMBDA_URL}/v1/brands/${id}`, {
        withCredentials: true,
      });
      console.log("edit brand response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching brand details:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col items-center mt-4 ">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        {" "}
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.error("❌ Google Login Failed")}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginWithGoogle;
