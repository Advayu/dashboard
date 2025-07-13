import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import React from "react";

type PaginationButtonProps = {
  onPrev: () => void;
  onNext: () => void;
  currentPage: number;
  totalPages: number;
};

const PaginationButton = ({
  onPrev,
  onNext,
  currentPage,
  totalPages,
}: PaginationButtonProps) => {
  return (
    <div className=" flex justify-center items-center space-x-4 mb-4">
      <div className="flex items-center gap-2">
        <ChevronLeftCircle
          className={`cursor-pointer text-blueTilt/80 hover:text-blueTilt ${currentPage === 1 ? "opacity-50" : ""}`}
          size={30}
          onClick={onPrev}
        />
        <span className="text-muted-foreground text-">
          Page {currentPage} of {totalPages}
        </span>
        <ChevronRightCircle
          className={`cursor-pointer text-blueTilt/80 hover:text-blueTilt ${currentPage === totalPages ? "opacity-50" : ""}`}
          type="button"
          onClick={onNext}
          size={30}
        />
      </div>
    </div>
  );
};

export default PaginationButton;
