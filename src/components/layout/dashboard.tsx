"use client";

import { useState, useEffect, useRef } from "react";
import CouponCard from "@/components/cards/couponCard";
import { UserRound } from "lucide-react";
import { HorizontalCarousel } from "@/components/crasoul/EmblaCarousel";
import GaugeComponent from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import Link from "next/link";
import { useDispatch } from "react-redux";

import { useGetOffers } from "@/hooks/use-offer";
import { useLogout } from "@/hooks/use-auth";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";

const ShimmerLoader: React.FC = () => (
  <div className="embla__slide w-[300px] h-[140px] bg-gray-200 animate-pulse rounded-md mt-2"></div>
);

const Dashboard = ({ user }: any) => {
  const dispatch = useDispatch();
  const { mutate: logout } = useLogout();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Reference for the menu
  const [brandUserName, setBrandUserName] = useState<string>("");
  const is_password_changed = useSelector(
    (state: RootState) => state.brandUser.is_password_changed
  );
  const [data, setData] = useState<any>(null);
  const brand = useSelector((state: RootState) => state.brand);
  // Todo: replace with actual brand_id from the redux store
  const { offers, error, isLoading } = useGetOffers(user?.brand_id);

  const router = useRouter();

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

  useEffect(() => {
    dispatch(
      setBrandUser({
        id: user?.id ?? "",
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        password_hash: user?.password_hash ?? "",
        brand_id: user?.brand_id ?? "",
        is_password_changed: user?.is_password_changed ?? false,
        created_at: user?.created_at ?? "",
        updated_at: user?.updated_at ?? "",
        role: user?.role ?? "",
        permissions: user?.permissions ?? [],
        is_active: user?.is_active ?? false,
        // Add any other required fields with sensible defaults if needed
      })
    );
  }, [user]);

  const renderOfferCards = () => {
    if (offers?.length === 0) {
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

    return (
      offers &&
      offers.map((offer: any, index: number) => (
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
      ))
    );
  };

  return (
    <>
      <div className="md:pl-10 md:mt-16 mt-[2rem]">
        <div className="flex justify-between items-center">
          <h1 className="md:text-3xl text-xl font-bold">
            Advayu X {user?.email}
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
                  logout();
                  // Handle logout logic here
                }}>
                Logout
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-col mt-8">
          <h2 className="text-xl font-bold md:block hidden">
            Active offers {offers && offers.length}
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
            Active offers ({offers && offers.length})
          </h2>
          {isLoading ? (
            <ShimmerLoader />
          ) : (
            <HorizontalCarousel>{renderOfferCards()}</HorizontalCarousel>
          )}
        </div>
      </div>

      {/* Error Handling */}
      {error && (
        <div className="error-message text-red-500">
          {typeof error === "string"
            ? error
            : error.message || error.toString()}
        </div>
      )}
    </>
  );
};

export default Dashboard;
