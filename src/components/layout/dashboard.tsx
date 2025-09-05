"use client";

import { useState, useEffect, useRef } from "react";
import CouponCard, { NoActiveOffers } from "@/components/cards/couponCard";
import { UserRound } from "lucide-react";
import GaugeComponent from "@/components/ui/ProgressBar";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";
import { useDispatch } from "react-redux";
import { useGetOffers } from "@/hooks/use-offer";
import { useLogout } from "@/hooks/use-auth";
import { setBrandUser } from "@/store/globalSlice/brandUserSlice";
import { CouponCardSkeleton } from "../ui/skeleton";
import PaginationButton from "../pagination-button";

const Dashboard = ({ user }: any) => {
  console.log("dashboard: user:", user);
  const dispatch = useDispatch();
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Reference for the menu
  //  Pagination states
  const [limit, setLimit] = useState(4);
  const [page, setPage] = useState(1);
  // Get active offers
  const { data, error, isLoading } = useGetOffers(
    {
      brand_id: user?.brand_id,
      status: "active",
      limit,
      page,
    },
    { enabled: !!user?.brand_id }
  ) as {
    data: { data: any[]; total: number; totalPages: number } | undefined;
    error: any;
    isLoading: boolean;
  };
  const offers = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;
  // Toggles the menu visibility
  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
  };

  // Handles clicks outside the menu
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //  Pagination controls
  // const totalPages = offers?.totalPages;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  useEffect(() => {
    dispatch(
      setBrandUser({
        id: user?.userId ?? "",
        name: user?.brandName ?? "",
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
    if (isLoading) {
      return (
        <div className="flex gap-4 py-4">
          {Array.from({ length: limit }).map((_, i) => (
            <CouponCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (isLoading) return <div>Loading offers...</div>;

    if (error) return <div>Error loading offers</div>;
    if (!offers?.length) {
      return (
        <div className="w-full flex justify-center mt-6">
          <NoActiveOffers />
        </div>
      );
    }

    return (
      <div className="flex gap-2 py-4">
        {offers.map((offer: any, index: number) => (
          <div className="mx-4" key={index}>
            <CouponCard
              id={offer.id}
              title={offer.title}
              number_of_redemptions={50}
              total_coupons={offer.total_limit}
              start_date={offer.start_date}
              expiry_date={offer.end_date}
              unique_code={offer.code}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="md:pl-10 md:mt-16 mt-[2rem]">
        <div className="flex justify-between items-center">
          <h1 className="md:text-3xl text-xl font-bold">
            Advayu X {user?.brandName}
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
            Active offers ({total || 0})
          </h2>

          <div className="md:block hidden">
            <div className="overflow-x-auto">{renderOfferCards()}</div>
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <GaugeComponent />
        <div className="md:ml-[16.3px] px-4">
          <h2 className="text-xl font-bold mb-4">
            Active offers ({offers && total})
          </h2>
          {isLoading ? (
            <CouponCardSkeleton />
          ) : (
            <div className="overflow-x-auto">{renderOfferCards()}</div>
          )}
        </div>
      </div>
      <PaginationButton
        onNext={handleNext}
        onPrev={handlePrevious}
        currentPage={page}
        totalPages={totalPages}
      />
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
