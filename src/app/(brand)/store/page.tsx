"use client";

import CouponCard from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@radix-ui/react-accordion";

import { useRouter } from "next/navigation";

// Material UI graphs
import LineGraph from "@/components/ui/lineGraph";
import { months, dataset } from "@/components/utils/dataset";

// Import select from shadcn
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeSelector } from "@/components/ui/date-picker";
import Loading from "@/components/loading";

// Import date picker from MUI
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { VerticalCarousel } from "@/components/crasoul/EmblaCarousel";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import { styled } from "@mui/material/styles";

import { useGetOutlets } from "@/hooks/use-outlet";
import { useGetOfferByOutletId } from "@/hooks/use-offer";
import { getOfferByOutletId } from "@/services/offer-service";

// sales with advayu
const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 10,
  borderRadius: "0rem",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#199EAD",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "0rem",
    backgroundColor: "#535353",
  },
}));

export default function Page() {
  const [loadingOffers, setLoadingOffers] = useState<Record<string, boolean>>(
    {}
  );

  const brand = useSelector((state: any) => state.brand);
  const [outlet, setOultet] = useState<any>([]);
  const [filteredOutlets, setFilteredOutlets] = useState<any[]>([]); // For filtered outlets
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search quer
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);
  const [offerByOutletId, setOfferByOutletId] = useState<any>({}); // Use an object to store offers by outletId
  const router = useRouter();
  const brandUserStr = localStorage.getItem("persist:brandUser");
  const brand_id = brandUserStr
    ? JSON.parse(brandUserStr)?.brand_id
    : undefined;
  const { data: outlets, isLoading: isLoadingOutlets } =
    useGetOutlets(brand_id);

  const handleAccordionClick = async (id: string) => {
    if (openAccordion === id) {
      // collapse if already open
      setOpenAccordion(null);
      return;
    }

    setOpenAccordion(id);

    // Avoid re-fetching if already cached
    if (offerByOutletId[id]) return;

    // Set per-outlet loading
    setLoadingOffers((prev) => ({ ...prev, [id]: true }));

    try {
      let offers = await getOfferByOutletId(id);
      offers = offers.data;

      setOfferByOutletId((prev: any) => ({
        ...prev,
        [id]: offers,
      }));
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoadingOffers((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddOutletClick = () => {
    // router push to add outlet

    router.push("/store/add");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter outlets based on the query
    const filtered = outlet.filter((outletItem: any) =>
      outletItem.name.toLowerCase().includes(query)
    );
    console.log("Filtered outlets:", filtered);
    setFilteredOutlets(filtered);
  };

  const brandName = brand.name;
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="md:w-[93%] w-full flex flex-col md:pl-10 md:mt-16 md:pr-4 mt-10 px-5">
      <div className="flex justify-between">
        <div>
          <h1 className="md:text-3xl text-xl font-bold">{brandName}</h1>
        </div>
        <div className="flex space-x-6 items-center">
          <Button onClick={handleAddOutletClick} variant={"outline"}>
            + Add Outlet
          </Button>
          <div className="md:flex space-x-2 items-center relative hidden">
            <Input
              type="text"
              placeholder="Search by outlet name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 w-72 py-5 border-gray-400"
            />
            <Search
              width={16}
              height={16}
              className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <div>
              <Filter width={16} height={16} />
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden space-x-2 items-center relative flex  mt-4">
        <Input
          type="text"
          placeholder="Search by outlet name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10 w-72 py-5 border-gray-400"
        />
        <Search
          width={16}
          height={16}
          className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
        />
        <div>
          <Filter width={16} height={16} />
        </div>
      </div>
      {outlets?.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <a>No outlets added yet.</a>

          <button
            className="px-2 py-2 bg-blueTilt rounded-lg text-white hover:bg-blueTilt/90 transition-all duration-300 ease-in-out"
            onClick={handleAddOutletClick}>
            + Add Outlet
          </button>
        </div>
      )}
      {outlets?.map((outletItem: any) => (
        <div
          className="flex bg-gray-100 rounded px-4 my-4 transition duration-300 fade-in"
          key={outletItem.id}>
          <Accordion type="single" collapsible className="w-[90vw]">
            <AccordionItem value={outletItem.id.toString()}>
              <AccordionTrigger
                onClick={() => handleAccordionClick(outletItem.id)}
                className="w-full text-xl font-bold flex flex-col py-4">
                <div className="flex flex-col w-full">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl">{outletItem.name}</h2>
                    <ChevronDown
                      width={16}
                      height={16}
                      className={`transition-transform duration-300 ${
                        openAccordion === outletItem.id
                          ? "rotate-180"
                          : "rotate-0"
                      }`}
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <p className="text-[#2AA000] text-sm">+888.8%</p>
                    <span className="text-black flex items-center space-x-1">
                      <svg
                        width="13"
                        height="11"
                        viewBox="0 0 13 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.5 0.0419922L7.84708 4.18789H12.2063L8.67963 6.7502L10.0267 10.8961L6.5 8.33379L2.97329 10.8961L4.32037 6.7502L0.793661 4.18789H5.15292L6.5 0.0419922Z"
                          fill="black"
                        />
                      </svg>
                      <p className="text-sm border-b-2 border-black">
                        4.6 (273)
                      </p>
                    </span>
                  </div>
                </div>
                <div></div>
              </AccordionTrigger>

              <AccordionContent>
                <div className="md:flex block">
                  <div className="">
                    <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 md:items-center">
                      <div className="flex space-x-4">
                        <h3 className="md:text-lg text-sm">
                          Sales with Advayu
                        </h3>
                        <Select>
                          <SelectTrigger className="w-[180px] border border-black">
                            <SelectValue placeholder="Select your year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Years</SelectLabel>
                              <SelectItem value="2022">2022</SelectItem>
                              <SelectItem value="2023">2023</SelectItem>
                              <SelectItem value="2024">2024</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex ">
                        <DateRangeSelector />
                      </div>
                    </div>
                    {/* sales with advayu */}
                    <div className="grid md:grid-cols-[1fr_4fr] gap-[1.5rem]  items-center mt-[16px]">
                      <p className="text-[#2AA000] md:text-3xl text-xl font-bold">
                        +888.8%
                      </p>
                      <div className="w-[95%] ">
                        <Stack spacing={2} sx={{ flexGrow: 1 }}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={70}
                          />
                        </Stack>
                      </div>
                    </div>
                    <div className="flex justify-between md:ml-40 items-center">
                      <p className="">Other</p>
                      <p className=" md:mr-[1.6rem] mr-[1rem]">Advayu</p>
                    </div>
                    <div className="md:block hidden">
                      <LineGraph dataset={dataset} />
                    </div>

                    {/* for small screen */}
                    <div className="lg:hidden flex flex-row gap-4 mt-4 max-w-[81vw] overflow-x-auto">
                      {isLoadingOffer
                        ? // Shimmer effect while loading
                          Array.from({ length: 3 }).map((_, index) => (
                            <div
                              key={index}
                              className="flex flex-row space-y-2 p-10 animate-pulse">
                              <div className="h-4 w-72 bg-gray-300 rounded"></div>
                            </div>
                          ))
                        : // Render offers when loaded
                          offerByOutletId[outletItem.id]?.map((offer: any) => (
                            <div key={offer.id} className="flex flex-row">
                              <CouponCard
                                id={offer.id}
                                title={offer.title}
                                start_date={offer.start_date}
                                expiry_date={offer.end_date}
                                unique_code={offer.code}
                                number_of_redemptions={0}
                                total_coupons={offer.total_limit}
                              />
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="lg:flex hidden flex-col pl-14 ">
                    <h2 className="text-lg font-normal">Active Offers</h2>

                    {/* Scrollable Container */}
                    <div className="mt-4 max-h-[29rem] overflow-y-auto">
                      {loadingOffers[outletItem.id]
                        ? // shimmer
                          Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="p-10 animate-pulse">
                              <div className="h-4 w-72 bg-gray-300 rounded"></div>
                            </div>
                          ))
                        : offerByOutletId[outletItem.id]?.map((offer: any) => (
                            <CouponCard
                              key={offer.id}
                              id={offer.id}
                              title={offer.title}
                              start_date={offer.start_date}
                              expiry_date={offer.end_date}
                              unique_code={offer.code}
                              number_of_redemptions={0}
                              total_coupons={offer.total_limit}
                            />
                          ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
