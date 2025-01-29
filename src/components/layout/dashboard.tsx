"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../ui/button";
import CouponCard from "@/components/cards/couponCard";
import { UserRound } from "lucide-react";
// import useEmblaCarousel from "embla-carousel-react";
// import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
// import Autoplay from "embla-carousel-autoplay";
// import { setMultipleOutletIds } from "@/store/slices/outletSlice";
import {
  HorizontalCarousel,
  VerticalCarousel,
} from "@/components/crasoul/EmblaCarousel";
import GaugeComponent from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { LAMBDA_URL } from "@/utils/constants";
import { useRouter } from "next/navigation";
import axios from "axios";
import { RootState } from "@/store/store";
import Link from "next/link";
import axiosInstance from "@/utils/axiosInstance";

const ShimmerLoader: React.FC = () => (
  <div className="embla__slide w-[300px] h-[140px] bg-gray-200 animate-pulse rounded-md mt-2"></div>
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for error handling
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Reference for the menu
  const [brandUserName, setBrandUserName] = useState<string>("");

  const brandUser = useSelector((state: RootState) => state.brandUser);
  const router = useRouter();

  // Helper function to get brand ID (either from Redux or localStorage)
  // const getBrandId = useCallback(() => {
  //   return brandUser?.brand_id;
  // }, [brandUser?.brand_id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const brandId = brandUser.brand_id;
      if (!brandId) {
        router.push(`/auth`);
        return;
      }

      setBrandUserName(brandUser?.name);
      const fetchOffers = async () => {
        setIsLoading(true); // Set loading to true
        const brand_id = brandUser.brand_id;
        try {
          const response = await axiosInstance.get(`${LAMBDA_URL}/offers`, {
            params: { brand_id },
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = response.data;
          const now = new Date();
          const ongoing = data.filter(
            (offer: any) =>
              new Date(offer.start_date) <= now &&
              new Date(offer.end_date) > now
          );
          setOffers(ongoing);
        } catch (error) {
          setError("Failed to load offers");
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
          ) {
            console.log("Unauthorized: Redirecting to login...");
            // router.push("/auth");
          } else {
            console.error("An error occurred", error);
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchOffers();
    }
  }, [router]); // Only run once on mount

  const handleLogoutClick = async () => {
    console.log("Logout clicked");

    // Clear localStorage items
    localStorage.removeItem("brandId");
    localStorage.removeItem("token");
    localStorage.removeItem("brandName");
    localStorage.removeItem("selectedOutletId");

    const response = await axios.post(
      `${LAMBDA_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    // Redirect to login
    if (response.status === 200) {
      router.push("/auth");
    }
  };

  // Toggles the menu visibility
  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  // Handles clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      console.log("Clicked outside menu");
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const renderOfferCards = () => {
    if (offers.length === 0) {
      return (
        <div className="m-auto">
          <h1 className="text-2xl font-bold">No Active offers found!</h1>
          <Link href="partner/offers/add" className="underline">
            Create an offer
          </Link>
        </div>
      );
    }

    return offers.map((offer, index) => (
      <div className="embla__slide" key={index}>
        <CouponCard
          id={offer.id}
          title={offer.title}
          number_of_redemptions={50} // Placeholder
          total_coupons={offer.total_limit}
          start_date={offer.start_date}
          expiry_date={offer.end_date}
          unique_code={offer.code} // Placeholder
        />
      </div>
    ));
  };

  return (
    <>
      <div className="pl-10 mt-16">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Advayu X {brandUserName}</h1>
          <button
            onClick={toggleMenu}
            className="md:block hidden mr-6 bg-gray-100 rounded-full p-2">
            <UserRound size={32} />
          </button>
        </div>
        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute right-[2rem]  mt-1 w-[8rem] bg-white border rounded-lg shadow-lg z-50 md:block hidden ">
            <ul className="text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  router.push("/profile");
                }}>
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  console.log("Logout clicked");
                  handleLogoutClick();
                  // Handle logout logic here
                }}>
                Logout
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-col mt-8">
          <h2 className="text-xl font-bold md:block hidden">
            Active offers ({offers.length})
          </h2>

          {/* Embla carousel for desktop */}
          <div className="md:block hidden">
            {isLoading ? (
              <ShimmerLoader />
            ) : (
              <HorizontalCarousel>{renderOfferCards()}</HorizontalCarousel>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <GaugeComponent />
        <div className="ml-[16.3px]">
          <h2 className="text-xl font-bold mb-4">
            Active offers ({offers.length})
          </h2>
          {isLoading ? (
            <ShimmerLoader />
          ) : (
            <HorizontalCarousel>{renderOfferCards()}</HorizontalCarousel>
          )}
        </div>
      </div>

      {/* Error Handling */}
      {error && <div className="error-message text-red-500">{error}</div>}
    </>
  );
};

export default Dashboard;
