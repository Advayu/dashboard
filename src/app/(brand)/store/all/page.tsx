"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
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
  const brandUserStr = localStorage.getItem("persist:brandUser");
  const brand_id = brandUserStr
    ? JSON.parse(brandUserStr)?.brand_id
    : undefined;
  const { data: outlets, isLoading } = useGetOutlets(brand_id);
  const { mutate: deleteOutlet } = useDeleteOutlet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);

  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`edit?outlet_id=${id}`);
  };

  const confirmDelete = (id: string) => {
    setSelectedOutletId(id);
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
          <div className="overflow-x-auto shadow-sm border rounded-lg">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-blueTilt/60">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Address</th>

                  <th className="px-4 py-2">Pincode</th>
                  <th className="px-4 py-2">Manager Phone</th>

                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {outlets?.map((outlet: any, key: number) => (
                  <OutletCard
                    key={key}
                    id={outlet.id}
                    name={outlet.name}
                    address={outlet.address}
                    pincode={outlet.postal_code}
                    phone={outlet.manager_phone}
                    onEdit={handleEdit}
                    onDelete={() => confirmDelete(outlet.id)}
                  />
                ))}
              </tbody>
            </table>
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
                <button className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => {
                    if (selectedOutletId) {
                      deleteOutlet(selectedOutletId);
                      setSelectedOutletId(null);
                      setIsDialogOpen(false);
                    }
                  }}>
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </div>
    </>
  );
};

export default AllOutletPage;
