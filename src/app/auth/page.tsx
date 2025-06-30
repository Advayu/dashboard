"use client";
import { useState, useEffect, FormEvent, use } from "react";
import { useDispatch } from "react-redux";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";
import { LAMBDA_URL } from "@/utils/constants";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { BrandUser } from "@/Types/type";
import { RootState } from "@/store/store";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";
import { BrandDetail } from "../partner-with-us/validationSchema";
import { setBrandData } from "@/store/globalSlice/brandSlice";
import LoginWithGoogle from "@/components/GoogleLogin";
import { useLogin } from "@/hooks/use-auth";

const Auth = () => {
  const { mutate: login, data, isError, error: loginError } = useLogin();

  const dispatch = useDispatch();
  const router = useRouter();
  const brandUser = useSelector((state: RootState) => state.brandUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    login({ email, password });
    console.log(data);
    // Fetch brand details
    // const brandUser = await getBrandByEmail(email);
    // const brandDetail = await getBrandDetails(brandUser?.brand_id || "");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white via-blueTilt/50 to-blueTilt/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg shadow-gray-500/40">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Advayu X Brands
        </h2>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 font-bold text-white bg-[#199EAD] rounded-lg hover:bg-[#1A9EB0]/50 transition-all duration-300`}>
          Sign in
        </button>

        <div className="h-[1px] w-full bg-gray-200 mt-4" />
        <LoginWithGoogle />
      </form>
    </div>
  );
};

export default Auth;
