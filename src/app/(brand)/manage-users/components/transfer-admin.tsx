"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useGetBrandUsers, useTransferAdmin } from "@/hooks/use-brand-user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type TransferAdminProps = {
  trigger: React.ReactNode;
};

type BrandUser = {
  id: string;
  name: string;
  email?: string;
  // Extend as needed
};

const TransferAdmin = ({ trigger }: TransferAdminProps) => {
  const brandUser = useSelector((state: RootState) => state.brandUser);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: users, isLoading, error } = useGetBrandUsers();
  const { mutate: transferAdmin, isPending } = useTransferAdmin({
    onSuccess: () => {
      setOpen(false);
      setSelectedUserId("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    transferAdmin({
      id: brandUser.id,
      newAdminId: selectedUserId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-lg font-semibold mb-4">
          Change Admin
        </DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="user-select"
              className="block text-sm font-medium mb-1">
              Choose a user to transfer admin rights
            </label>

            <Select
              required
              value={selectedUserId}
              onValueChange={setSelectedUserId}
              disabled={isLoading || !users?.length}>
              <SelectTrigger id="user-select" className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user: BrandUser) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="submit"
            disabled={isPending || !selectedUserId}
            className="w-full bg-blueTilt hover:bg-blueTilt text-white py-2 rounded-md font-medium transition disabled:opacity-50">
            {isPending ? "Transferring..." : "Change Admin"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferAdmin;
