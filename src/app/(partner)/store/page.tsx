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
import axios from "axios";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

import { styled } from "@mui/material/styles";
import { LAMBDA_URL } from "@/utils/constants";
import axiosInstance from "@/utils/axiosInstance";

// sales with advayu
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
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
  const brandUser = useSelector((state: any) => state.brandUser);
  const [outlet, setOultet] = useState<any>([]);
  const [filteredOutlets, setFilteredOutlets] = useState<any[]>([]); // For filtered outlets
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search quer
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingOffer, setIsLoadingOffer] = useState(true);
  const [offerByOutletId, setOfferByOutletId] = useState<any>({}); // Use an object to store offers by outletId
  const router = useRouter();

  useEffect(() => {
    // Fetch outlet data only once

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${LAMBDA_URL}/v1/outlets?searchType=Exact&brand_id=${
            brandUser.brand_id
          }`,
          { withCredentials: true }
        );
        console.log("Outlet data:", response.data);
        setOultet(response.data);
        setFilteredOutlets(response.data); // Initialize filtered outlets
      } catch (error) {
        console.error("Error fetching outlet data:", error);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [brandUser.brand_id]); // Dependency array to ensure fetch happens only when `brand.id` changes

  const fetchOutletOfferDetailsByOutletId = async (id: string) => {
    if (offerByOutletId[id]) {
      return;
    }

    setIsLoadingOffer(true);
    try {
      const response = await axiosInstance.get(
        `${LAMBDA_URL}/offers?outlet_id=${id}`,
        {
          withCredentials: true,
        }
      );
      console.log("Offers data:", response.data);
      const now = new Date();
      const ongoing = response.data.filter(
        (offer: any) =>
          new Date(offer.start_date) <= now && new Date(offer.end_date) > now
      );
      setOfferByOutletId((prevState: any) => ({
        ...prevState,
        [id]: ongoing,
      }));
      setOpenAccordion(filteredOutlets[0].id);
    } catch (error) {
      console.error("Error fetching outlet offers:", error);
    } finally {
      setIsLoadingOffer(false);
    }
  };

  const handleAccordionClick = (id: string) => {
    if (openAccordion !== id) {
      setOpenAccordion(id); // Set the clicked outlet ID as open
      fetchOutletOfferDetailsByOutletId(id); // Fetch offers when the accordion is opened
    } else {
      setOpenAccordion(null); // Close the accordion if it's already open
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

  const brandName = brandUser.name;
  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="w-[93%] flex flex-col pl-10 mt-16 pr-4">
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">{brandName}</h1>
        </div>
        <div className="md:flex space-x-6 items-center hidden">
          <Button onClick={handleAddOutletClick} variant={"outline"}>
            + Add Outlet
          </Button>
          <div className="flex space-x-2 items-center relative">
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

      {isLoading ? (
        <div className="flex items-center justify-center w-full mx-auto h-full">
          <Loading />
        </div>
      ) : filteredOutlets && filteredOutlets.length == 0 ? (
        <div className="m-auto flex flex-col items-center gap-4">
          <p>
            No outlet found <span className="font-bold">{searchQuery}</span>
          </p>

          <Button onClick={() => router.push(`/store/add?name=${searchQuery}`)}>
            Create Outlet
          </Button>
        </div>
      ) : (
        filteredOutlets.map((outletItem: any) => (
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
                </AccordionTrigger>

                <AccordionContent>
                  <div className="md:flex block">
                    <div className="">
                      <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 md:items-center">
                        <div className="flex space-x-4">
                          <h3 className="text-lg">Sales with Advayu</h3>
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
                      <div className="grid md:grid-cols-[1fr_4fr]  items-center mt-[16px]">
                        <p className="text-[#2AA000] text-3xl font-bold">
                          +888.8%
                        </p>
                        <div className="w-full">
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
                        <p className="">Advayu</p>
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
                            offerByOutletId[outletItem.id]?.map(
                              (offer: any) => (
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
                              )
                            )}
                      </div>
                    </div>

                    <div className="lg:flex hidden flex-col pl-14 ">
                      <h2 className="text-lg font-normal">Active Offers</h2>

                      {/* Scrollable Container */}
                      <div className="mt-4 max-h-[29rem] overflow-y-auto">
                        {isLoadingOffer
                          ? // Shimmer effect while loading
                            Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={index}
                                className="flex flex-col space-y-2 p-10 animate-pulse">
                                <div className="h-4 w-72 bg-gray-300 rounded"></div>
                                <div className="h-3 w-72 bg-gray-300 rounded"></div>
                                <div className="h-5 w-72 bg-gray-300 rounded"></div>
                              </div>
                            ))
                          : // Render offers when loaded
                            offerByOutletId[outletItem.id]?.map(
                              (offer: any) => (
                                <div key={offer.id} className="flex flex-col">
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
                              )
                            )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))
      )}
    </div>
    // </LocalizationProvider>
  );
}
