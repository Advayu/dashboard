"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { useGetOutlets } from "@/hooks/use-outlet";
import { useGetOffers } from "@/hooks/use-offer";
import OfferAccordionSection from "@/components/ui/OfferAccordionSection";
import { RootState } from "@/store/store";
import Link from "next/link";
import { CouponCardSkeleton } from "@/components/ui/skeleton";

type OfferStatus = "active" | "draft" | "upcoming" | "expired";

interface PaginationState {
  page: number;
  limit: number;
}

const INITIAL_PAGINATION: Record<OfferStatus, PaginationState> = {
  active: { page: 1, limit: 4 },
  draft: { page: 1, limit: 4 },
  upcoming: { page: 1, limit: 4 },
  expired: { page: 1, limit: 4 },
};

export default function Page() {
  const brandUser = useSelector((state: RootState) => state.brandUser);

  // Outlets
  const {
    data: outlets,
    isLoading: isLoadingOutlets,
    error: outletsError,
  } = useGetOutlets(brandUser?.brand_id);

  // OutletId state initializes once outlets are loaded
  const [outletId, setOutletId] = useState<string>("");

  useEffect(() => {
    if (outlets && outlets.length > 0 && !outletId) {
      setOutletId(outlets[0].id);
    }
  }, [outlets, outletId]);

  // Pagination state for all statuses
  const [pagination, setPagination] =
    useState<Record<OfferStatus, PaginationState>>(INITIAL_PAGINATION);

  // Handler for page changes (next or prev) for a given offer status
  const handlePageChange = useCallback(
    (status: OfferStatus, direction: "next" | "prev", totalPages: number) => {
      if (totalPages < 1) return; // Guard against invalid total pages

      setPagination((prev) => {
        const currentPage = prev[status]?.page ?? 1;
        const newPage =
          direction === "next"
            ? Math.min(currentPage + 1, totalPages)
            : Math.max(currentPage - 1, 1);

        return {
          ...prev,
          [status]: {
            ...prev[status],
            page: newPage,
          },
        };
      });
    },
    [] // Empty dependencies array is correct here
  );

  // Separate hook calls for each status
  const activeOffers = useGetOffers({
    brand_id: brandUser?.brand_id,
    outlet_id: outletId,
    status: "active",
    page: pagination.active.page,
    limit: pagination.active.limit,
  });

  const draftOffers = useGetOffers({
    brand_id: brandUser?.brand_id,
    outlet_id: outletId,
    status: "draft",
    page: pagination.draft.page,
    limit: pagination.draft.limit,
  });

  const upcomingOffers = useGetOffers({
    brand_id: brandUser?.brand_id,
    outlet_id: outletId,
    status: "upcoming",
    page: pagination.upcoming.page,
    limit: pagination.upcoming.limit,
  });

  const expiredOffers = useGetOffers({
    brand_id: brandUser?.brand_id,
    outlet_id: outletId,
    status: "expired",
    page: pagination.expired.page,
    limit: pagination.expired.limit,
  });

  const offersData = {
    active: activeOffers,
    draft: draftOffers,
    upcoming: upcomingOffers,
    expired: expiredOffers,
  };

  const handleOutletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOutletId(e.target.value);
    // Reset pagination on outlet change if needed
    setPagination(INITIAL_PAGINATION);
  };

  return (
    <div className="flex flex-col md:mt-16 md:pl-10 mt-10 px-5 md:w-[93%] w-full h-full mb-28">
      <TopSection />

      {/* Outlet Dropdown */}
      <div className="mt-4 mb-4 flex flex-col">
        <label htmlFor="outlet-dropdown" className="">
          Select outlet
        </label>
        <select
          value={outletId}
          onChange={handleOutletChange}
          className="border-2 border-black rounded-md p-2  max-w-[17rem]"
          disabled={isLoadingOutlets || !!outletsError}>
          <option value="">
            {isLoadingOutlets
              ? "Loading outlets..."
              : outlets?.length
                ? "Select Outlet"
                : "No outlets available"}
          </option>

          {outlets?.map((outlet: any) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
      </div>

      {/* Offer Accordions */}
      <Accordion type="multiple" defaultValue={["active", "upcoming"]}>
        <OfferAccordionSection
          title={"Active Offers"}
          value={`active`}
          offerQuery={activeOffers}
          onPageChange={handlePageChange}
        />
        <OfferAccordionSection
          title={"Upcoming Offers"}
          value={`upcoming`}
          offerQuery={upcomingOffers}
          onPageChange={handlePageChange}
        />
        <OfferAccordionSection
          title={"Draft Offers"}
          value={`draft`}
          offerQuery={draftOffers}
          onPageChange={handlePageChange}
        />
        <OfferAccordionSection
          title={"Expired Offers"}
          value={`expired`}
          offerQuery={expiredOffers}
          onPageChange={handlePageChange}
        />
      </Accordion>
    </div>
  );
}

const TopSection = () => {
  const brandUser = useSelector((state: RootState) => state.brandUser);
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  return (
    <div className="flex justify-between md:pr-8">
      <h1 className="md:text-3xl text-xl font-bold">
        {brandUser?.name || "Your"} Offers
      </h1>
      <div className="flex space-x-6 items-center">
        <Link
          href="/offers/add"
          className="px-3 py-2 rounded-md border border-black hover:bg-blueTilt/10 hover:border-blueTilt transition-all ease-in-out duration-200">
          + Add Offer
        </Link>
        <div className="md:flex hidden space-x-2 items-center relative">
          <Input
            type="text"
            placeholder="Search by offer title"
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10 w-72 py-5 border-gray-400"
          />
          <Search
            width={16}
            height={16}
            className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>
      </div>
    </div>
  );
};
