import Image from "next/image";
import checker from "../../../public/image/checker.svg";
import { Delete } from "lucide-react";

interface InventoryCardProps {
  imagePath: string;
  name: string;
  productId: string;
  category: string;
  quantity: number;
  price: number;
  onDelete: () => void;
}

const InventoryCard = ({
  imagePath = checker,
  name = "",
  productId = "",
  category = "",
  quantity = 0,
  price = 0,
  onDelete,
}: InventoryCardProps) => {
  // if (
  //   !imagePath ||
  //   !name ||
  //   !productId ||
  //   !category ||
  //   !quantity ||
  //   !price ||
  //   !onDelete
  // ) {
  //   throw new Error("Missing required prop in InventoryCard");
  // }

  return (
    <div className="flex flex-row border rounded-md py-4 px-2 space-x-4 shadow">
      {/* Image */}
      <div>
        <Image
          src={imagePath}
          alt="image"
          width={500}
          height={200}
          className="rounded mr-4 max-w-40 max-h-32"
        />
      </div>

      <div className="">
        {/* Product Details Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="font-bold">{name}</h1>
            <h1>{productId}</h1>
          </div>
          <div className="flex ml-4">
            <button
              onClick={onDelete}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blueTilt hover:cursor-pointer hover:text-red-700 "
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a1 1 0 00-1 1v1H5a1 1 0 00-1 1v1h12V5a1 1 0 00-1-1h-4V3a1 1 0 00-1-1z" />
                <path d="M4 7v10a2 2 0 002 2h8a2 2 0 002-2V7H4zm2 2h8v8H6V9z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="">
          <span> {category}</span>
        </div>
        <div>
          <span> {quantity}</span>
        </div>
        <div>
          <span>${price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
