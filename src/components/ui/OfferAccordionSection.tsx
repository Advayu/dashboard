import React from "react";
import Link from "next/link";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"; // Ensure the correct import path
import { HorizontalCarousel } from "@/components/crasoul/EmblaCarousel"; // Ensure the correct import path
import CouponCard from "@/components/cards/couponCard"; // Ensure the correct import path

interface OfferAccordionSectionProps {
  title: string;
  offers: any[];
  value: string;
}

const OfferAccordionSection: React.FC<OfferAccordionSectionProps> = ({
  title,
  offers,
  value,
}) => {
  console.log("offers", offers);
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-bold text-xl">
        {title} ({offers?.length})
      </AccordionTrigger>
      <AccordionContent className="flex space-x-2">
        {offers?.length === 0 ? (
          <div className="flex flex-col md:items-center md:justify-center w-full h-full md:text-center">
            <h1 className="text-xl text-gray-500 font-bold">
              No {title} found!
            </h1>
            <Link href="offers/add" className="underline ">
              Create an offer
            </Link>
          </div>
        ) : (
          <HorizontalCarousel>
            {offers?.map((offer, index) => (
              <div className="embla__slide " key={index}>
                <CouponCard
                  id={offer.id}
                  title={offer.title}
                  start_date={offer.start_date}
                  expiry_date={offer.end_date}
                  offer_type={offer.offer_type}
                  number_of_redemptions={0}
                  total_coupons={offer.total_limit}
                />
              </div>
            ))}
          </HorizontalCarousel>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default OfferAccordionSection;
