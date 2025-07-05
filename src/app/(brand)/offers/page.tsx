"use client";
import { useEffect, useState } from "react";
import CouponCard from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import { Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import { Offer } from "@/Types/type";
import { HorizontalCarousel } from "@/components/crasoul/EmblaCarousel";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Autoplay from "embla-carousel-autoplay";

import Loading from "@/components/loading";

import OfferAccordionSection from "@/components/ui/OfferAccordionSection";
import { useGetOutlets } from "@/hooks/use-outlet";

export default function Page() {
  const brandUserStr = localStorage.getItem("persist:brandUser");
  const brand_id = brandUserStr
    ? JSON.parse(brandUserStr)?.brand_id
    : undefined;
  const { data: outlets, isLoading: isLoadingOutlets } =
    useGetOutlets(brand_id);
  const [outletId, setOutletId] = useState<string>("");
  const [offers, setOffers] = useState<{
    upComming: any[];
    ongoing: any[];
    past: any[];
    draft: any[];
  }>({
    upComming: [],
    ongoing: [],
    past: [],
    draft: [],
  });

  const [filteredOffers, setFilteredOffers] = useState(offers);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const brand = useSelector((state: any) => state.brand);

  // Fetch outlets when component mounts

  // Handle outlet change in dropdown
  const handleOutletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOutletId = event.target.value;
    setOutletId(selectedOutletId); // Set the outletId to trigger offers fetch
  };

  // let brandName = brand.name || localStorage.getItem("brandName");

  let brandName = brand.name;

  const router = useRouter();
  const handleAddOffer = () => {
    router.push("offers/add");
  };

  return (
    <div className="flex flex-col md:mt-16 md:pl-10 mt-10 px-5 md:w-[93%] w-full h-full tranition-all fade-in  duration-300 mb-28">
      <div className="flex justify-between  md:pr-8 ">
        <h1 className=" md:text-3xl text-xl font-bold">{brandName} Offers</h1>
        <div className="flex   space-x-6 items-center">
          {/* drop down to select outlet  */}
          <Button className="" onClick={handleAddOffer} variant={"outline"}>
            + Add Offer
          </Button>
          <div className="md:flex hidden  space-x-2 items-center relative">
            <Input
              type="text"
              placeholder="Search by offer code"
              // value={searchQuery}
              // onChange={handleSearch}
              className="pl-10 w-72 py-5 border-gray-400"
            />
            <Search
              width={16}
              height={16}
              className="text-gray-500 absolute left-3  top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            <div>
              <Filter width={16} height={16} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 mb-4">
        <select
          value={outletId}
          onChange={handleOutletChange}
          className="border-2 border-black rounded-md p-2 w-[17rem] max-w-[17rem]">
          <option disabled>Select Outlet</option>
          {outlets?.map((outlet: any) => (
            <option key={outlet.id} value={outlet.id}>
              {outlet.name}
            </option>
          ))}
        </select>
      </div>

      <div className="">
        <Accordion
          type="multiple"
          defaultValue={["item-1", "item-2"]}
          className="">
          <OfferAccordionSection
            title="Active offers"
            offers={filteredOffers.ongoing}
            value="item-1"
          />
          <OfferAccordionSection
            title="Upcoming offers"
            offers={filteredOffers.upComming}
            value="item-2"
          />
          <OfferAccordionSection
            title="Draft"
            offers={filteredOffers.draft}
            value="item-3"
          />
          <OfferAccordionSection
            title="Previous offers"
            offers={filteredOffers.past}
            value="item-4"
          />
        </Accordion>
      </div>
    </div>
  );
}
