"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Minus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Line } from "recharts";
import LineGraph from "@/components/ui/lineGraph";
import { dataset } from "@/components/utils/dataset";
import CouponCard from "@/components/cards/couponCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import qrcode from "../../../../../public/image/qrcode.png";
import contact from "../../../../../public/image/contact.svg";
import Image from "next/image";
import { ReadOnlyInput } from "@/components/ui/input";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LAMBDA_URL } from "@/utils/constants";
const Page = () => {
  const [offer, setOffer]: any = useState<{ applicable_days: Day[] }>({
    applicable_days: [],
  });

  const { toast } = useToast();
  const router = useRouter();
  const User = () => (
    <svg
      width="42"
      height="42"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.92764 11.7256C4.00194 11.0728 3.30813 10.1422 2.94672 9.0687C2.58532 7.99518 2.57508 6.83448 2.9175 5.75476C3.25992 4.67504 3.93721 3.73238 4.85125 3.06335C5.76528 2.39433 6.86858 2.03369 8.0013 2.03369C9.13402 2.03369 10.2373 2.39433 11.1514 3.06335C12.0654 3.73238 12.7427 4.67504 13.0851 5.75476C13.4275 6.83448 13.4173 7.99518 13.0559 9.0687C12.6945 10.1422 12.0007 11.0728 11.075 11.7256L12.4636 14.8989C12.4859 14.9497 12.4952 15.0053 12.4906 15.0606C12.486 15.1158 12.4677 15.1691 12.4373 15.2155C12.4069 15.2619 12.3654 15.3 12.3166 15.3263C12.2677 15.3527 12.2131 15.3664 12.1576 15.3662H3.8443C3.78891 15.3663 3.73438 15.3526 3.68562 15.3263C3.63686 15.3 3.59543 15.262 3.56506 15.2157C3.53468 15.1694 3.51633 15.1162 3.51166 15.061C3.50699 15.0058 3.51615 14.9503 3.5383 14.8996L4.92764 11.7256ZM9.41764 11.2636L10.3056 10.6362C11.0001 10.1468 11.5207 9.44891 11.792 8.64374C12.0632 7.83857 12.0711 6.96794 11.8143 6.15802C11.5576 5.3481 11.0496 4.64097 10.3641 4.1391C9.6785 3.63722 8.85094 3.36668 8.0013 3.36668C7.15167 3.36668 6.3241 3.63722 5.63854 4.1391C4.95297 4.64097 4.44501 5.3481 4.18828 6.15802C3.93155 6.96794 3.93938 7.83857 4.21064 8.64374C4.48189 9.44891 5.00248 10.1468 5.69697 10.6362L6.5843 11.2636L5.37297 14.0329H10.629L9.41764 11.2636ZM5.41364 8.01292L6.70697 7.68958C6.77874 7.97849 6.94514 8.23507 7.17964 8.41845C7.41415 8.60182 7.70328 8.70145 8.00097 8.70145C8.29866 8.70145 8.58779 8.60182 8.8223 8.41845C9.0568 8.23507 9.2232 7.97849 9.29497 7.68958L10.5883 8.01292C10.4433 8.58924 10.11 9.10065 9.64126 9.46602C9.17255 9.83139 8.59526 10.0298 8.00097 10.0298C7.40667 10.0298 6.82939 9.83139 6.36068 9.46602C5.89197 9.10065 5.55867 8.58924 5.41364 8.01292Z"
        fill="#2AA000"
      />
    </svg>
  );

  type Day =
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";

  // Define the mapping of day names to their short form
  const dayMap: Record<Day, string> = {
    Sunday: "S",
    Monday: "M",
    Tuesday: "T",
    Wednesday: "W",
    Thursday: "T",
    Friday: "F",
    Saturday: "S",
  };

  // useEffect call
  useEffect(() => {
    const fetchOfferDetail = async () => {
      try {
        // Extract the offerId from the URL query params
        const urlParams = new URLSearchParams(window.location.search);
        const offerId = urlParams.get("offerId");

        if (offerId) {
          // Make the API request to fetch offer details
          const response = await axios.get(`${LAMBDA_URL}/offers/${offerId}`, {
            withCredentials: true,
          });

          console.log("offer details", response);
          setOffer(response.data); // Store the data in state
        } else {
          console.log("Offer ID is missing in the URL.");
          // setError("Offer ID is missing in the URL.");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch offer details.",
        });
        router.push("/offers");
        // Handle any error that occurs during the request
        console.log("Error fetching offer detail:", err);
        // setError("Failed to fetch offer details.");
        console.error("Error fetching offer detail:", err);
      } finally {
        // setLoading(false); // Stop loading when the request is done
      }
    };

    fetchOfferDetail(); // Call the function to fetch offer details
    console.log("offer details", offer);
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // handle back click to go back to previous page
  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const deleteOffer = async () => {
    if (offer.id != null || offer.id != undefined || offer.id != "") {
      const deleteOffer = await axios.delete(
        `${LAMBDA_URL}/offers/${offer.id}`,
        { withCredentials: true }
      );
      console.log(deleteOffer);
      if (deleteOffer.status == 200) {
        toast({
          variant: "success",
          title: "Offer deleted successfully",
        });
        router.push("/offers");
      } else {
        toast({
          variant: "destructive",
          title: "Failed to delete offer. Please try again",
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between my-10 mx-8">
        <button className="flex items-center" onClick={handleBackClick}>
          <ChevronLeft />
          <h1 className="text-3xl font-black ">Offer analytics</h1>
        </button>
        <div className="flex space-x-4 mx-2">
          <button>
            <Image src={contact} alt="contact" />
          </button>
        </div>
      </div>

      {/* start */}

      <section className="flex md:flex-row flex-col space-x-2 px-10">
        <div className="mx-2 pr-[40px] ">
          <ReadOnlyInput
            label="Offer Title"
            id="offerTitle"
            defaultValue={offer.title}
            containerClassName="custom-container-class"
            labelClassName="custom-label-class"
            inputClassName="custom-input-class"
          />
          <div className="md:block flex space-x-4 md:space-x-0 ">
            <div className="flex flex-col md:flex-row my-4 md:space-y-0 space-y-2 md:space-x-4 md:items-center">
              <Label>Offer Category</Label>
              <Input
                disabled
                className="border-none font-bold bg-[#F3F3F3] w-40"
                type="text"
                defaultValue={offer.discount_type}
              />
            </div>

            <div className="my-4 space-y-2">
              <Label>Offer Code</Label>
              <Input
                disabled
                className="border-none font-bold w-full bg-[#F3F3F3] py-6 outline md:outline-none"
                type="text"
                defaultValue={offer.code}
              />
            </div>
          </div>

          <div className="flex my-4 items-center space-x-4">
            <Label>Status of offer</Label>
            <Input
              disabled
              className="border-none font-bold bg-[#F3F3F3]"
              type="text"
              defaultValue={offer.is_active ? "Active" : "Inactive"}
            />
          </div>

          {/* steper  */}

          <div className="flex items-center">
            {/* Vertical Line with Circles */}
            <div className="relative flex flex-col items-center mr-4">
              {/* Line */}
              <div className="h-16 w-0.5 bg-teal-600"></div>
              {/* Circles */}
              <div className="absolute top-0 h-2 w-2 bg-teal-600 rounded-full"></div>
              <div className="absolute top-16 h-2 w-2 bg-teal-600 rounded-full"></div>
            </div>

            {/* Form Section */}
            <div>
              {/* Start Date */}
              <div className="flex items-center mb-6">
                <label className="text-lg font-medium mr-4">Start date</label>

                <Input
                  disabled
                  type="date"
                  defaultValue={
                    offer?.start_date ? offer.start_date.split("T")[0] : ""
                  }
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>

              {/* Expiry Date */}
              <div className="flex items-center">
                <label className="text-lg font-medium mr-4">Expiry date</label>
                <Input
                  disabled
                  type="date"
                  defaultValue={
                    offer?.end_date ? offer.end_date.split("T")[0] : ""
                  }
                  className="border border-black rounded-md px-4 py-2 text-center w-36"
                />
              </div>
            </div>
          </div>

          {/* steper */}

          <div className="my-4">
            <Label>Maximum offer redemption</Label>
            <Input
              disabled
              className="border-none font-bold w-full mt-2"
              type="text"
              defaultValue={offer.total_limit}
            />
          </div>
          {/* <div>
          <Label>
            Maximum offer redemption{" "}
            <span className="underline"> per user </span>
          </Label>
          <Input
            disabled
            className="border-none font-bold w-full bg-[#F3F3F3]"
            type="text"
            defaultValue={""}
          />
          </div> */}
          {/* <div className="my-4">
            <Label>Duration between redemption days</Label>
            <Input
              disabled
              className="border-none font-bold w-full bg-[#F3F3F3]"
              type="text"
              defaultValue={""}
            />
          </div> */}
          <ToggleGroup
            type="multiple"
            value={offer.applicable_days}
            onValueChange={(value) =>
              setOffer({ ...offer, applicable_days: value })
            }>
            {Object.keys(dayMap).map((day) => (
              <ToggleGroupItem key={day} value={day} className="w-full">
                {dayMap[day as Day]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        {/* separator */}
        {/* dotted */}
        <Separator
          className="md:block hidden  border-[#D1D1D1]  border-l-2 border-dashed"
          orientation="vertical"
        />

        <Separator
          orientation="horizontal"
          className="block md:hidden  border-[#D1D1D1]  divide-dashed border-2	 my-4"
        />

        <div className="flex flex-col ml-10">
          <h1 className="text-xl font-bold pl-[40px]">Analytics</h1>
          {/* offer redemption */}
          <div className="flex md:flex-row md:space-y-0 space-y-[24.5px] flex-col space-x-10 my-8 md:items-center">
            <div className=" mx-10">
              <p>Offer redemption</p>
              <div className="flex items-center text-center">
                <User />
                <p className="text-3xl mx-2">{offer.total_redemption} </p>
                <span className="text-[#2AA000] font-bold">( 0 %)</span>
              </div>
            </div>
            <div className="md:space-y-0 space-y-[5px]">
              <p>offer ranking</p>
              <p className=" text-3xl font-bold">
                #233 <span className="text-base font-normal	 "> /9.232+ </span>
              </p>
            </div>
          </div>

          <div>
            {/* <div className="flex space-x-2 items-center">
                            <p> Redemption pattern</p>
                            <div className="flex items-center">
                                <Input className="border-gray-400 text-gray-400 font-bold" type="date" />
                                <Minus />
                                <Input className="border-gray-400 text-gray-400 font-bold" type="date" />
                            </div>
                        </div> */}
            {/* <LineGraph dataset={dataset} toggle={false} /> */}
          </div>
          <div className="flex justify-between mx-10">
            <CouponCard
              id={offer.id}
              title={offer.title}
              start_date={
                offer?.start_date ? offer.start_date.split("T")[0] : ""
              }
              expiry_date={offer?.end_date ? offer.end_date.split("T")[0] : ""}
              unique_code={offer.code}
              total_coupons={offer.total_limit}
              number_of_redemptions={0}
            />

            {/* <Image src={qrcode} alt="qr code" /> */}
          </div>
          <div className="flex justify-end pr-[40px] my-8 space-x-2">
            <Button
              onClick={deleteOffer}
              className="px-4"
              size={"thin"}
              variant={"outline"}>
              Delete
            </Button>
            {/* <Button className="px-4" size={"thin"} variant={"outline"}>
              Duplicate
            </Button>
            <Button className="px-4" size={"thin"} variant={"outline"}>
              Disable
            </Button> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
