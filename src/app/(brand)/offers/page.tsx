"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";

import { useGetOutlets } from "@/hooks/use-outlet";
import { useGetOfferByOutletId } from "@/hooks/use-offer";

import OfferAccordionSection from "@/components/ui/OfferAccordionSection";
import Loading from "@/components/loading";
import { isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { RootState } from "@/store/store";

export default function Page() {
  const router = useRouter();

  const [outletId, setOutletId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brand_user = useSelector((state: RootState) => state.brandUser);

  const {
    data: outlets,
    isLoading: isLoadingOutlets,
    error: outletsError,
  } = useGetOutlets(brand_user?.brand_id);

  let {
    offer: offers = [],
    isLoading: isLoadingOffers,
    error: offersError,
  } = useGetOfferByOutletId(outletId);

  const offersData = Array.isArray(offers?.data) ? offers.data : [];

  // Set initial outletId once outlets load
  useEffect(() => {
    if (outlets?.length && !outletId) {
      setOutletId(outlets[0].id);
    }
  }, [outlets, outletId]);

  const handleOutletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutletId(event.target.value);
  };

  const handleAddOffer = () => {
    router.push("/offers/add");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Categorize offers
  const today = new Date();

  const filteredOffers = offersData?.filter((offer: any) =>
    offer?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizeOffers = () => {
    const draft: any[] = [];
    const upcoming: any[] = [];
    const ongoing: any[] = [];
    const past: any[] = [];

    for (const offer of filteredOffers) {
      const start = parseISO(offer.start_date);
      const end = parseISO(offer.end_date);

      if (!offer.is_active || offer.status === "DRAFT") {
        draft.push(offer);
      } else if (isAfter(start, today)) {
        upcoming.push(offer);
      } else if (isWithinInterval(today, { start, end })) {
        ongoing.push(offer);
      } else if (isBefore(end, today)) {
        past.push(offer);
      }
    }

    return { draft, upcoming, ongoing, past };
  };

  const { draft, upcoming, ongoing, past } = categorizeOffers();

  if (isLoadingOutlets || isLoadingOffers)
    return (
      <div className="flex w-full h-full items-center justify-center">
        <Loading />
      </div>
    );
  if (outletsError || offersError)
    return (
      <div className="w-full h-full items-center text-center justify-center text-red-500 mt-10 border">
        Error loading data.
      </div>
    );

  return (
    <div className="flex flex-col md:mt-16 md:pl-10 mt-10 px-5 md:w-[93%] w-full h-full  mb-28">
      <div className="flex justify-between md:pr-8">
        <h1 className="md:text-3xl text-xl font-bold">
          {brand_user?.name || "Your"} Offers
        </h1>
        <div className="flex space-x-6 items-center">
          <Button onClick={handleAddOffer} variant="outline">
            + Add Offer
          </Button>
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
            {/* <Filter width={16} height={16} /> */}
          </div>
        </div>
      </div>

      {/* Outlet Dropdown */}
      <div className="mt-4 mb-4">
        <select
          value={outletId}
          onChange={handleOutletChange}
          className="border-2 border-black rounded-md p-2 w-[17rem] max-w-[17rem]">
          <option disabled value="">
            Select Outlet
          </option>
          {outlets?.map((outlet: any) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
      </div>

      {/* Offer Accordion */}
      <div>
        <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
          <OfferAccordionSection
            title="Active Offers"
            offers={ongoing}
            value="item-1"
          />
          <OfferAccordionSection
            title="Upcoming Offers"
            offers={upcoming}
            value="item-2"
          />
          <OfferAccordionSection title="Draft" offers={draft} value="item-3" />
          <OfferAccordionSection
            title="Previous Offers"
            offers={past}
            value="item-4"
          />
        </Accordion>
      </div>
    </div>
  );
}
