"use client";

import React, { useState } from "react";
import {
  useDeleteBrandUser,
  useGetBrandUsers,
  useSetBrandUserStatus,
} from "@/hooks/use-brand-user";
import InviteUser from "./components/invite-user";
import TransferAdmin from "./components/transfer-admin";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { navigateToPreviousPage } from "@/functions/function";

const ManageUsersPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useGetBrandUsers();
  const { mutate: deleteUser } = useDeleteBrandUser();
  const { mutate: setStatus } = useSetBrandUserStatus();

  const handleDeleteClick = (id: string) => {
    setSelectedUserId(id);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedUserId) return;
    deleteUser(selectedUserId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["brand-users"] });
        setDialogOpen(false);
        setSelectedUserId(null);
      },
    });
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 inline-flex items-center cursor-pointer" onClick={navigateToPreviousPage}> <ChevronLeft /> Manage Users</h1>
        <div className="flex items-center gap-2">
          <TransferAdmin
            trigger={
              <button className="bg-blueTilt hover:bg-blueTilt/60 text-white px-5 py-2 rounded-md transition">
                Transfer Admin
              </button>
            }
          />
          <InviteUser
            trigger={
              <button className="bg-blueTilt hover:bg-blueTilt/60 text-white px-5 py-2 rounded-md transition">
                Invite User
              </button>
            }
          />
        </div>
      </header>

      {/* User Table */}
      <section className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 border-b text-xs uppercase text-gray-600">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-red-500">
                  Failed to load users.
                </td>
              </tr>
            )}
            {users?.map((user: any) => (
              <tr key={user.id} className={`border-b hover:bg-gray-50 ${user.role === "admin" ? "hidden" : ""}`}>
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4">
                  <Switch

                    checked={user.is_active}
                    onCheckedChange={(checked) =>
                      setStatus({ id: user.id, status: checked })
                    }
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteClick(user.id)}
                    className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md transition">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Confirm Delete Dialog */}
        <AlertDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-md w-[90vw] max-w-sm">
            <AlertDialog.Title className="text-lg font-bold">
              Confirm Deletion
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </AlertDialog.Description>
            <div className="mt-4 flex justify-end space-x-3">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 bg-gray-200 rounded">
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={confirmDelete}>
                  Delete
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </section>
    </main>
  );
};

export default ManageUsersPage;
