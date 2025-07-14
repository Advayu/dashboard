"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useInviteBrandUser } from "@/hooks/use-brand-user";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DialogDescription } from "@radix-ui/react-dialog";

type InviteUserProps = {
  trigger: React.ReactNode;
};

const InviteUser = ({ trigger }: InviteUserProps) => {
  const { brand_id } = useSelector((state: RootState) => state.brandUser);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  const { mutate: inviteUser, isPending } = useInviteBrandUser({
    onSuccess: () => {
      setOpen(false);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    inviteUser({ brand_id, email });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogTitle className="text-lg font-semibold mb-4">
          Invite User
        </DialogTitle>
        <DialogDescription></DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            aria-required="true"
            type="email"
            name="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blueTilt hover:bg-blueTilt/80 text-white py-2 rounded-md font-medium transition disabled:opacity-60">
            {isPending ? "Sending..." : "Send Invite"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
