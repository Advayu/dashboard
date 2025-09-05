"use server";
import React from "react";
import Dashboard from "@/components/layout/dashboard";
import NotificationCard from "@/components/cards/notificationCard";
// TODO: Replace this with actual data from the backend
import { notification as dummyNotification } from "@/dummydata/notification";
import { decodeJWT } from "@/lib/decodeJWT";
import DashboardGraphs from "@/components/dashboard-graphs";

export default async function Page() {
  // getting decoded jwt token from cookies to get details like {email, brand_id}
  const data = await decodeJWT();
  console.log("pre: dashboard", data);

  return (
    <div className="w-full md:w-[96vw] md:px-0 px-4  ">
      <Dashboard />

      <div className="flex md:flex-row flex-col gap-10">
        <div className="flex flex-row  md:ml-10  md:mb-0 mb-20">
          <NotificationCard notification={dummyNotification} />
        </div>
        <div className=" w-full  mr-6">
          <DashboardGraphs />
        </div>
      </div>
    </div>
  );
}
