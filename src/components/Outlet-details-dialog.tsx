"use client";

import OutletDetails from "@/app/(brand)/store/edit/page";
import {
  Dialog,
  DialogContent,
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
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <OutletDetails id={outletId} />
      </DialogContent>
    </Dialog>
  );
}
