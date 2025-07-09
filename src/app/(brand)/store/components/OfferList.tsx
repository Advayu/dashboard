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
      <h2 className="text-lg font-semibold ">Active Offers</h2>
      <div className="flex flex-row lg:flex-col mt-4 gap-2 lg:max-h-[29rem] overflow-y-auto lg:min-h-[26rem]">
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
        <div className="mt-6 flex justify-center items-center space-x-4 border-t pt-4 mb-4">
          <div className="flex items-center gap-2">
            <Button type="button" onClick={onPrev} variant="outline" size="lg">
              Prev
            </Button>
            <span className="text-muted-foreground text-">
              Page {currentPage} of {totalPages}
            </span>
            <Button type="button" onClick={onNext} size="lg">
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
