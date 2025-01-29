import React from "react";
import { Trash, Pencil } from "lucide-react";

interface OutletCardProps {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const OutletCard = ({
  id,
  name,
  address,
  city,
  state,
  pincode,
  phone,
  email,
  onDelete,
  onEdit,
}: OutletCardProps) => {
  return (
    <div className="relative w-80 h-80 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer">
      {/* Edit and Delete Icons */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          onClick={(e) => {
            onEdit(id);
          }}
          className="p-1 rounded-full  hover:bg-blue-100 text-gray-500 hover:text-blue-500 transition-colors"
          aria-label="Edit">
          <Pencil />
        </button>
        <button
          onClick={(e) => {
            onDelete(id);
          }}
          className="p-1 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-500 transition-colors"
          aria-label="Delete">
          <Trash />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6 flex flex-col justify-between ">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2 truncate">
            {name}
          </h2>
          <p className="text-gray-600 text-sm mb-4 truncate">{address}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div>
            <strong className="block font-medium">City:</strong>
            <span>{city}</span>
          </div>
          <div>
            <strong className="block font-medium">State:</strong>
            <span>{state}</span>
          </div>

          <div>
            <strong className="block font-medium">Pincode:</strong>
            <span>{pincode}</span>
          </div>
          <div>
            <strong className="block font-medium">Phone:</strong>
            <span>{phone}</span>
          </div>
          <div>
            <strong className="block font-medium">Email:</strong>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutletCard;
