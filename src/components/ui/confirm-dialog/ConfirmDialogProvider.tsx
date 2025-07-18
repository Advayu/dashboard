"use client";

import React, { createContext, useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { ConfirmDialogOptions } from "./types";

type ConfirmDialogContextType = {
    confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
};

export const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined);

export const ConfirmDialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogOptions, setDialogOptions] = useState<ConfirmDialogOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const confirm = (options: ConfirmDialogOptions): Promise<boolean> => {
        setDialogOptions(options);
        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        resolvePromise?.(true);
        closeDialog();
    };

    const handleCancel = () => {
        resolvePromise?.(false);
        closeDialog();
    };

    const closeDialog = () => {
        setDialogOptions(null);
        setResolvePromise(null);
    };

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}
            <AlertDialog open={!!dialogOptions} onOpenChange={closeDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{dialogOptions?.title ?? "Are you sure?"}</AlertDialogTitle>
                        {dialogOptions?.description && (
                            <AlertDialogDescription>{dialogOptions.description}</AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancel}>
                            {dialogOptions?.cancelText || "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction className={dialogOptions?.variant === "destructive" ? "bg-red-600" : ""} onClick={handleConfirm}>
                            {dialogOptions?.confirmText || "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmDialogContext.Provider>
    );
};