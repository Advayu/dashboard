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
import { get } from "http";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosInstance";

const Auth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const brandUser = useSelector((state: RootState) => state.brandUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [brandId, setBrandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [isLogedin, setIsLogedin] = useState(false);

  // Extract brandId from URL query
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      //   console.log("URL Params:", urlParams.get("brandId"));
      setBrandId(urlParams.get("brandId"));
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(`${LAMBDA_URL}/auth/login`, {
        email,
        password,
      });

      // Store brand ID in localStorage
      if (response.data?.id) {
        localStorage.setItem("brandId", response.data.id);
      }

      // Show success toast
      toast({
        variant: "success",
        title: "Login successful",
      });

      // Fetch brand details
      const brand = await getBrandByEmail(email);
      if (brand) {
        // Handle brand details if fetched
        dispatch(setBrandUser(brand));
        setBrandName(brand.name);
      }

      // Redirect to partner page
      router.push(`/`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md"
      >
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
            className="block mb-2 text-sm font-semibold"
          >
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
          className={`w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 ${
            loading && "cursor-not-allowed opacity-50"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default Auth;
