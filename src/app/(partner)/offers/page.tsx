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
import { set } from "zod";
import Loading from "@/components/loading";
import { LAMBDA_URL } from "@/utils/constants";
import axios from "axios";
import Link from "next/link";
import OfferAccordionSection from "@/components/ui/OfferAccordionSection";

export default function Page() {
  const [outlets, setOutlets] = useState<any[]>([]);
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

  const [isLoading, setIsLoading] = useState(true);

  const brand = useSelector((state: any) => state.brand);

  // Fetch outlets when component mounts
  const getLocalStorageItem = (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  };

  useEffect(() => {
    const fetchOutlets = async () => {
      const brandId = brand?.id || getLocalStorageItem("brandId");
      console.log("brandId:", brandId);

      if (!brandId) {
        router.push("/auth");
        return;
      }

      try {
        const response = await axios.get(`${LAMBDA_URL}/v1/outlets`, {
          params: { brand_id: brandId },
          withCredentials: true,
        });

        const data = response.data;
        setOutlets(data);

        const savedOutletId = getLocalStorageItem("selectedOutletId");
        if (
          savedOutletId &&
          data.some((outlet: any) => outlet.id === savedOutletId)
        ) {
          setOutletId(savedOutletId);
        } else if (data.length > 0) {
          setOutletId(data[0].id);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching outlets:", error);
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.status === 401
        ) {
          console.log("Unauthorized: Redirecting to login...");
          router.push("/auth");
        } else {
          console.error("An error occurred", error);
        }
      }
    };

    fetchOutlets();
  }, [brand?.id]); // Dependency on brand's brand_id

  useEffect(() => {
    if (!outletId) return;

    const fetchOffers = async () => {
      try {
        const response = await fetch(
          `${LAMBDA_URL}/offers?outlet_id=${outletId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!response.ok) {
          router.push("/auth");
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();
        const now = new Date();

        const newOffers = {
          upComming: data.filter(
            (offer: any) =>
              new Date(offer.start_date) > now && new Date(offer.end_date) > now
          ),
          ongoing: data.filter(
            (offer: any) =>
              new Date(offer.start_date) <= now &&
              new Date(offer.end_date) > now
          ),
          past: data.filter((offer: any) => new Date(offer.end_date) <= now),
          draft: data.filter((offer: any) => !offer.is_active),
        };

        setOffers(newOffers);
        setFilteredOffers(newOffers);
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();

    // Save the selected outlet ID to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedOutletId", outletId);
    }
  }, [outletId]);

  // Handle outlet change in dropdown
  const handleOutletChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOutletId = event.target.value;
    setOutletId(selectedOutletId); // Set the outletId to trigger offers fetch
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredOffers(offers); // Reset filtered offers if query is empty
      return;
    }

    // Filter offers based on the search query
    const filtered = {
      upComming: offers.upComming.filter((offer) =>
        offer.code.toLowerCase().includes(query)
      ),
      ongoing: offers.ongoing.filter((offer) =>
        offer.code.toLowerCase().includes(query)
      ),
      past: offers.past.filter((offer) =>
        offer.code.toLowerCase().includes(query)
      ),
      draft: offers.draft.filter((offer) =>
        offer.code.toLowerCase().includes(query)
      ),
    };

    setFilteredOffers(filtered);
  };

  // let brandName = brand.name || localStorage.getItem("brandName");

  let brandName = brand.name;

  const router = useRouter();
  const handleAddOffer = () => {
    router.push("offers/add");
  };

  return isLoading ? (
    <div className="flex justify-center w-full m-auto">
      <Loading />
    </div>
  ) : (
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
              value={searchQuery}
              onChange={handleSearch}
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
          <option value="" disabled>
            Select Outlet
          </option>
          {outlets.map((outlet) => (
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
