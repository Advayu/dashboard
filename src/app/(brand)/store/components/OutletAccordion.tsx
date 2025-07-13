// components/outlets/OutletAccordion.tsx
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useGetOfferByOutletId } from "@/hooks/use-offer";
import SalesGraph from "./SalesGraph";
import OfferList from "./OfferList";
import { CouponCardSkeleton } from "@/components/ui/skeleton";

interface Outlet {
  id: string;
  name: string;
}

interface Props {
  outlet: Outlet;
}

export default function OutletAccordion({ outlet }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);
  const { offer, isLoading, error, total, currentPage, totalPages } =
    useGetOfferByOutletId(outlet.id, limit, page);

  const nextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="bg-blueTilt/5 rounded px-4 my-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={outlet.id}>
          <AccordionTrigger
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-xl font-bold py-4 flex justify-between items-center">
            <h2>{outlet.name}</h2>
            <ChevronDown
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
              width={16}
              height={16}
            />
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 flex lg:flex-row flex-col gap-10">
              <SalesGraph id={outlet.id} />
              {isLoading ? (
                <CouponCardSkeleton />
              ) : (
                <OfferList
                  offers={offer.data}
                  loading={isLoading}
                  currentPage={page}
                  totalPages={totalPages}
                  onNext={nextPage}
                  onPrev={prevPage}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
