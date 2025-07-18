import React from "react";
import { Trash, Pencil, Eye } from "lucide-react";
import OutletDetailsDialog from "../Outlet-details-dialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRole } from "@/hooks/use-role";
interface OutletCardProps {
  id: string;
  name: string;
  address: string;

  pincode: string;
  phone: string;

  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const OutletCard = ({
  id,
  name,
  address,

  pincode,
  phone,

  onEdit,
  onDelete,
}: OutletCardProps) => {
  const { isAdmin } = useRole()
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-800">{name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{address}</td>

      <td className="px-4 py-3 text-sm text-gray-600">{pincode}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{phone}</td>

      <td className="px-4 py-3 flex space-x-2">
        <OutletDetailsDialog
          outletId={id}
          trigger={
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-full hover:bg-blueTilt/20 text-blueTilt/80 hover:text-blueTilt"
              aria-label="Edit">
              {isAdmin ? <Pencil /> : <Eye />}
            </button>
          }
        />
        {isAdmin &&
          <button
            onClick={() => onDelete(id)}
            className={`text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 `}
            title="Delete">
            <Trash />
          </button>
        }
      </td>
    </tr>
  );
};

export default OutletCard;
