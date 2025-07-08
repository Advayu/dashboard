// components/outlets/OfferList.tsx
import { Button } from "@/components/ui/button";
import CouponCard from "@/components/cards/couponCard";

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
      <h2 className="text-lg font-semibold">Active Offers</h2>
      <div className="mt-4 space-y-4 max-h-[29rem] overflow-y-auto">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-72 bg-gray-300 rounded animate-pulse"
              />
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
        <div className="flex justify-center mt-4 space-x-2">
          <Button disabled={currentPage === 1} onClick={onPrev}>
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button disabled={currentPage === totalPages} onClick={onNext}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
