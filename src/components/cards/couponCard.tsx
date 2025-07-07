"use client";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// CouponCard.tsx
import { useRouter } from "next/navigation";
import React from "react";
import { Link } from "lucide-react";
dayjs.extend(utc);
dayjs.extend(timezone);
interface CouponCardProps {
  id: number;
  title: string;
  number_of_redemptions: number;
  start_date: string;
  expiry_date: string;
  unique_code: string;
  total_coupons: number;
}

// svg
const Calander = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#676767"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-calendar">
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const Arrow = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 33 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.184896 2.9707C0.184896 4.44346 1.3788 5.63737 2.85156 5.63737C4.32432 5.63737 5.51823 4.44346 5.51823 2.9707C5.51823 1.49794 4.32432 0.304036 2.85156 0.304036C1.3788 0.304037 0.184896 1.49794 0.184896 2.9707ZM33.0059 2.9707L28.0059 0.0839495L28.0059 5.85745L33.0059 2.9707ZM2.85156 3.4707L28.5059 3.4707L28.5059 2.4707L2.85156 2.4707L2.85156 3.4707Z"
      fill="#676767"
    />
  </svg>
);

const User = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.92764 11.7256C4.00194 11.0728 3.30813 10.1422 2.94672 9.0687C2.58532 7.99518 2.57508 6.83448 2.9175 5.75476C3.25992 4.67504 3.93721 3.73238 4.85125 3.06335C5.76528 2.39433 6.86858 2.03369 8.0013 2.03369C9.13402 2.03369 10.2373 2.39433 11.1514 3.06335C12.0654 3.73238 12.7427 4.67504 13.0851 5.75476C13.4275 6.83448 13.4173 7.99518 13.0559 9.0687C12.6945 10.1422 12.0007 11.0728 11.075 11.7256L12.4636 14.8989C12.4859 14.9497 12.4952 15.0053 12.4906 15.0606C12.486 15.1158 12.4677 15.1691 12.4373 15.2155C12.4069 15.2619 12.3654 15.3 12.3166 15.3263C12.2677 15.3527 12.2131 15.3664 12.1576 15.3662H3.8443C3.78891 15.3663 3.73438 15.3526 3.68562 15.3263C3.63686 15.3 3.59543 15.262 3.56506 15.2157C3.53468 15.1694 3.51633 15.1162 3.51166 15.061C3.50699 15.0058 3.51615 14.9503 3.5383 14.8996L4.92764 11.7256ZM9.41764 11.2636L10.3056 10.6362C11.0001 10.1468 11.5207 9.44891 11.792 8.64374C12.0632 7.83857 12.0711 6.96794 11.8143 6.15802C11.5576 5.3481 11.0496 4.64097 10.3641 4.1391C9.6785 3.63722 8.85094 3.36668 8.0013 3.36668C7.15167 3.36668 6.3241 3.63722 5.63854 4.1391C4.95297 4.64097 4.44501 5.3481 4.18828 6.15802C3.93155 6.96794 3.93938 7.83857 4.21064 8.64374C4.48189 9.44891 5.00248 10.1468 5.69697 10.6362L6.5843 11.2636L5.37297 14.0329H10.629L9.41764 11.2636ZM5.41364 8.01292L6.70697 7.68958C6.77874 7.97849 6.94514 8.23507 7.17964 8.41845C7.41415 8.60182 7.70328 8.70145 8.00097 8.70145C8.29866 8.70145 8.58779 8.60182 8.8223 8.41845C9.0568 8.23507 9.2232 7.97849 9.29497 7.68958L10.5883 8.01292C10.4433 8.58924 10.11 9.10065 9.64126 9.46602C9.17255 9.83139 8.59526 10.0298 8.00097 10.0298C7.40667 10.0298 6.82939 9.83139 6.36068 9.46602C5.89197 9.10065 5.55867 8.58924 5.41364 8.01292Z"
      fill="#2AA000"
    />
  </svg>
);

const CouponCard: React.FC<any> = ({
  id,
  title,
  number_of_redemptions,
  total_coupons,
  expiry_date,
  start_date,
  offer_type,
}) => {
  console.log("offer_type", offer_type);
  const router = useRouter();
  // percentage of offer redemption
  const percentage_of_offer_redemption = Math.floor(
    (number_of_redemptions / total_coupons) * 100
  );
  const formatted_percentage = `${
    percentage_of_offer_redemption > 0 ? "+" : ""
  }${percentage_of_offer_redemption}%`;

  // expiry soon check
  const expirySoon: boolean =
    new Date(expiry_date).getTime() - Date.now() < 86400000 * 7;

  // start date convert to months and date only
  var start_date_months = dayjs(start_date)
    .tz("Asia/Kolkata")
    .format("DD MMM YYYY");

  // expiry date convert to months and date only
  var expiry_date_months = dayjs(expiry_date)
    .tz("Asia/Kolkata")
    .format("DD MMM YYYY");

  // console.log(Number(new Date(expiry_date)));

  const handleOfferClick = (id: number) => {
    //TODO: Redirect to offer analytics page with offer id
    console.log("offer id coupon card component", id);
    router.push(`/offers/analytics?offerId=${id}`);
  };

  return (
    <div
      onClick={() => handleOfferClick(id)}
      className="border border-blueTilt rounded-xl my-2 flex min-h-[7.5rem] min-w-72 relative bg-white">
      {expirySoon && (
        <div className="ribbon absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold rounded-full px-3 ">
          expires soon
        </div>
      )}

      {/* Coupon effect */}
      <div className="grid max-w-[3rem] border-l-0 border-blueTilt flex-col absolute ml-[3px] left-[-4px] top-1/2 transform -translate-y-1/2 w-4 h-6 bg-white border rounded-r-full"></div>

      {/* Coupon content */}
      <div className="grid grid-cols-[15rem_3rem] w-full ">
        <div className="flex flex-col   w-full pl-[24px] ">
          <h3
            className="text-sm font-bold text-gray-900 pb-[16px] truncate mt-[6px]"
            title={title}>
            {title}
          </h3>

          <div className="flex flex-row  mt-[17px]  ">
            <span className="mr-2 w-4">
              <User />
            </span>
            <p className="text-xs text-gray-700">
              {number_of_redemptions} / {total_coupons}
            </p>
            <p className="text-[#2AA000] text-xs font-bold ml-2">
              {formatted_percentage}
            </p>
          </div>

          <div className="flex items-center  ">
            <span className="mr-2 w-4">
              <Calander />
            </span>
            <p className="text-xs text-gray-700">{start_date_months}</p>
            <span className="mx-2">
              <Arrow />
            </span>
            <p className="text-xs text-gray-700">{expiry_date_months}</p>
          </div>
        </div>

        {/* Unique code of coupon */}
        <div className="flex items-center justify-center border-l-2 border-dashed border-blueTilt border-black">
          <p className="transform -rotate-90 text-xs font-bold  text-gray-700 uppercase">
            {offer_type === "COUPON_CODE" ? "Coupon Code" : "Auto Apply"}
          </p>
        </div>
      </div>
    </div>
  );
};

interface CouponbigProps {
  totalLimit: number;
  startDate: string;
  endDate: string;
  title: string;
  discountCode: string;
}

const Couponbig = ({
  totalLimit,
  startDate,
  endDate,
  title,
  discountCode,
}: CouponbigProps) => {
  const startDateIST = dayjs(startDate)
    .tz("Asia/Kolkata")
    .format("DD MMM YYYY");
  const endDateIST = dayjs(endDate).tz("Asia/Kolkata").format("DD MMM YYYY");
  return (
    <div className="border border-blueTilt rounded-xl my-2 flex  relative bg-white">
      {/* Coupon effect */}
      <div className="flex border-l-0 border-blueTilt flex-col absolute ml-[3px] left-[-4px] top-1/2 transform -translate-y-1/2 w-4 h-6 bg-white border rounded-r-full"></div>

      {/* Coupon content */}
      <div className="flex w-full  justify-between">
        <div className="flex flex-col pr-4 py-4 pl-6">
          <h3 className="text-2xl	 font-bold text-gray-900"> {title}</h3>

          <div className="flex items-center my-2">
            <span className="mr-2 w-4">
              <User />
            </span>
            <p className="text-xs text-gray-700">
              -- /{" "}
              <span className="text-[#2AA000] text-xs font-bold">
                {totalLimit}
              </span>
            </p>
          </div>

          <div className="flex items-center my-2">
            <span className="mr-4 w-4">
              <Calander />
            </span>
            <p className="text-xs text-gray-700">
              {startDateIST.split("T")[0]}
            </p>
            <span className="mx-2">
              <Arrow />
            </span>
            <p className="text-xs text-gray-700">{endDateIST.split("T")[0]}</p>
          </div>
        </div>

        {/* Unique code of coupon */}
        <div className="flex items-center justify-center border-l-2 border-dashed border-blueTilt pl-2">
          <p className="transform -rotate-90 text-xl font-bold leading-4 text-gray-700">
            {discountCode}
          </p>
        </div>
      </div>
    </div>
  );
};

const NoActiveOffers = () => {
  return (
    <>
      <div className="border border-blueTilt rounded-xl my-2 flex  relative bg-white">
        {/* Coupon effect */}
        <div className="flex border-l-0 border-blueTilt flex-col absolute ml-[3px] left-[-4px] top-1/2 transform -translate-y-1/2 w-4 h-6 bg-white border rounded-r-full"></div>

        <a
          href="offers/add"
          className="flex w-[20vw] h-[10vh]  justify-center items-center gap-2 ">
          <h1 className="underline  underline-offset-4 text-black">
            No active offers!
          </h1>

          <Link className="text-blueTilt" to={"/offers/add"} />
        </a>
      </div>
    </>
  );
};

export default CouponCard;
export { Couponbig, NoActiveOffers };
