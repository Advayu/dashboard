import React from "react";
import Link from "next/link";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import CouponCard from "@/components/cards/couponCard";
import PaginationButton from "../pagination-button";
import { CouponCardSkeleton } from "./skeleton";

interface OfferAccordionSectionProps {
  title: string;
  value: string;
  offerQuery: any;
  onPageChange: (
    status: "active" | "draft" | "upcoming" | "expired",
    direction: "next" | "prev",
    totalPages: number
  ) => void;
}

const OfferAccordionSection: React.FC<OfferAccordionSectionProps> = ({
  title,
  value,
  offerQuery,
  onPageChange,
}) => {
  console.log("offerQuery", offerQuery);
  const { data, isLoading, isError } = offerQuery;

  const offers = data?.data || [];
  const total = data?.total || 0;
  const page = Number(data?.page) || 1;
  const totalPages = data?.totalPages || 1;

  function onNextPage() {
    onPageChange(
      value as "active" | "draft" | "upcoming" | "expired",
      "next",
      offers?.totalPages ?? 1
    );
  }

  function onPrevPage() {
    onPageChange(
      value as "active" | "draft" | "upcoming" | "expired",
      "prev",
      offers?.totalPages ?? 1
    );
  }

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-bold text-xl">
        {title} ({total})
      </AccordionTrigger>
      <AccordionContent className="flex space-x-2">
        {isLoading && (
          <div className="flex ">
            <CouponCardSkeleton />
          </div>
        )}
        {offers?.length === 0 && !isLoading && (
          <div className="flex flex-col md:items-center md:justify-center w-full h-full md:text-center">
            <h1 className="text-xl text-gray-500 font-bold">
              No {title} found!
            </h1>
            <Link href="offers/add" className="underline ">
              Create an offer
            </Link>
          </div>
        )}
        {!isLoading && offers?.length > 0 && (
          <div className="flex flex-col w-full  ">
            <div className="flex flex-row  gap-4 overflow-x-auto">
              {offers?.map((offer: any, index: number) => (
                <CouponCard
                  key={index}
                  id={offer.id}
                  title={offer.title}
                  start_date={offer.start_date}
                  expiry_date={offer.end_date}
                  offer_type={offer.offer_type}
                  number_of_redemptions={0}
                  total_coupons={offer.total_limit}
                />
              ))}
            </div>
            <PaginationButton
              onNext={onNextPage}
              onPrev={onPrevPage}
              currentPage={page}
              totalPages={totalPages}
            />
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default OfferAccordionSection;
