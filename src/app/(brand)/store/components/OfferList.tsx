// components/outlets/OfferList.tsx
import { Button } from "@/components/ui/button";
import CouponCard from "@/components/cards/couponCard";
import {
  ChevronLeftCircle,
  ChevronLeftIcon,
  ChevronRightCircle,
} from "lucide-react";
import PaginationButton from "@/components/pagination-button";
import { CouponCardSkeleton } from "@/components/ui/skeleton";

interface Offer {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  code: string;
  total_limit: number;
}

interface Props {
  offers: Offer[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function OfferList({
  offers,
  loading,
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold ">Active Offers</h2>
      <div className="flex flex-row lg:flex-col mt-4 gap-2 lg:max-h-[29rem] overflow-y-auto lg:min-h-[26rem] ">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <CouponCardSkeleton key={i} />
            ))
          : offers?.map((offer) => (
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
      {offers.length > 0 && (
        <div className="mt-8 border-t  border-dashed border-gray-200 pt-4 ">
          <PaginationButton
            onPrev={onPrev}
            onNext={onNext}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}
