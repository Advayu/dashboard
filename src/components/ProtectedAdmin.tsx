// components/auth/ProtectedAdmin.tsx
import { decodeJWT } from "@/lib/decodeJWT";
import { notFound } from "next/navigation";
import React from "react";

export default async function ProtectedAdmin({
    children,
}: {
    children: React.ReactNode;
}) {
    const decoded = await decodeJWT();

    const userRole = decoded?.role;

    if (userRole !== "admin") {
        notFound(); // show 404
    }

    return <>{children}</>;
}