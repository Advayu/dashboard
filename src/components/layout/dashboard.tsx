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
import { toast } from "@/hooks/use-toast";

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
  const is_password_changed = useSelector(
    (state: RootState) => state.brandUser.is_password_changed
  );
  const brand = useSelector((state: RootState) => state.brand);
  const router = useRouter();

  useEffect(() => {
    if (!is_password_changed) {
      const toastId = toast({
        action: (
          <Link
            href="/profile"
            onClick={() => {
              toastId.dismiss(); // Dismiss the toast when the button is clicked
            }}>
            <Button>Change Password</Button>
          </Link>
        ),
        title: "Change Password",
        description: "Please change your password to continue.",
        className: "bg-white text-black",
        duration: 50000, // Keeps the toast visible for 50 seconds unless manually dismissed
      });

      // Redirect to the change password page after showing the toast
      setTimeout(() => {
        router.push("/profile");
      }, 3000); // Redirect after 3 seconds
    }
    if (typeof window !== "undefined") {
      const brandId = brand.id;
      if (!brandId) {
        router.push(`/auth`);
        return;
      }

      setBrandUserName(brand?.name);
      const fetchOffers = async () => {
        setIsLoading(true); // Set loading to true
        const brand_id = brand.id;
        try {
          const response = await axiosInstance.get(`${LAMBDA_URL}/offers`, {
            params: { brand_id },
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
    localStorage.clear();

    const response = await axiosInstance.post(`${LAMBDA_URL}/auth/logout`);
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
        <div className="md:m-auto">
          <h1 className="md:text-2xl text-xl font-bold">
            No Active offers found!
          </h1>
          <Link href="offers/add" className="underline">
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
      <div className="md:pl-10 md:mt-16 mt-[2rem]">
        <div className="flex justify-between items-center">
          <h1 className="md:text-3xl text-xl font-bold">
            Advayu X {brandUserName}
          </h1>
          <button
            onClick={toggleMenu}
            className=" md:mr-6 bg-gray-100 rounded-full p-2">
            <UserRound size={32} />
          </button>
        </div>
        {isMenuVisible && (
          <div
            ref={menuRef}
            className="absolute md:right-[2rem] right-0  mt-1 w-[8rem] bg-white border rounded-lg shadow-lg z-50  ">
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
        <div className="md:ml-[16.3px]">
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
