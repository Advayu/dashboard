"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Support from "../../../../../public/image/contact.svg";
import OutletCard from "@/components/cards/outletCard";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useGetOutlets, useDeleteOutlet } from "@/hooks/use-outlet";

const handleBackClick = () => {
  window.history.back();
};

interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  email: string;
}

const AllOutletPage = () => {
  const brandUserId = useSelector(
    (state: RootState) => state.brandUser.brand_id
  );
  const { data: outlets, isLoading } = useGetOutlets(brandUserId);
  const { mutate: deleteOutlet } = useDeleteOutlet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`edit?outlet_id=${id}`);
  };

  const confirmDelete = (id: string) => {
    deleteOutlet(id);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex justify-between my-10 mx-8 items-center">
          <div className="flex items-center">
            <button className="flex  items-center" onClick={handleBackClick}>
              <ChevronLeft />
              <h1 className="md:text-3xl	font-black"> All Outlets</h1>
            </button>
          </div>
          <div className=" md:flex hidden flex-col md:flex-row space-x-4 mx-2 items-center">
            <h3 className="md:text-xl text-xs">support@advayu.club</h3>
            <p>+91 9123456789</p>
            <Image
              className="md:hidden block"
              src={Support}
              alt="support"
              width={50}
              height={50}
            />
          </div>
          <Image className="md:hidden block" src={Support} alt="support" />
        </div>

        {/* Contact Info */}
        <div className="mx-4 sm:mx-6 md:mx-8">
          <div className="flex flex-wrap gap-4 md:justify-start justify-center">
            {outlets.map((outlet, key) => (
              <div key={key}>
                <OutletCard
                  id={outlet.id}
                  name={outlet.name}
                  address={outlet.address}
                  city={outlet.city}
                  state={outlet.state}
                  pincode={outlet.postal_code}
                  phone={outlet.phone}
                  email={outlet.email}
                  onEdit={handleEdit}
                  onDelete={() => confirmDelete(outlet.id)} // Trigger dialog
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Dialog */}
      <AlertDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-md">
          <AlertDialog.Title className="text-lg font-bold">
            Confirm Deletion
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-2 text-sm">
            Are you sure you want to delete this outlet? This action cannot be
            undone.
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end space-x-4">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default AllOutletPage;
