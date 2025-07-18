"use client";

import OutletDetails from "@/app/(brand)/store/edit/edit-outlet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

export default function OutletDetailsDialog({
  outletId,
  trigger,
}: {
  outletId: string;
  trigger: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTitle></DialogTitle>
      <DialogDescription></DialogDescription>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" id={outletId}>
        <OutletDetails id={outletId} />
      </DialogContent>
    </Dialog>
  );
}
