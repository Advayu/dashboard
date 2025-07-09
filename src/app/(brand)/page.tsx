"use server";
import React from "react";
import Dashboard from "@/components/layout/dashboard";
import NotificationCard from "@/components/cards/notificationCard";

// import Map from "@/components/ui/Map"
import LineGraph from "@/components/ui/lineGraph"; //to show the outlet traffic
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// TODO: Replace this with actual data from the backend
import { notification as dummyNotification } from "@/dummydata/notification";
import { decodeJWT } from "@/lib/decodeJWT";
import DashboardGraphs from "@/components/dashboard-graphs";

export default async function Page() {
  // getting decoded jwt token from cookies to get details like {email, brand_id}
  const data = await decodeJWT();

  return (
    <div className="md:w-[100vw] w-full md:mx-0 px-4">
      <Dashboard user={data} />

      <div className="flex flex-row  md:ml-10 mt-16 md:mb-0 mb-20">
        <NotificationCard notification={dummyNotification} />

        <div>
          <div className="ml-12 w-[30vw] md:block hidden ">
            <p className="font-bold text-xl">Active users</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4" />
              <Input
                className="pl-10 border border-black rounded-md w-70 mt-2"
                type="text"
                placeholder="Search for an area"
              />
            </div>
            {/* Active users map */}
            {/* <Map lat={0} long={0} height={371} width={809} /> */}
            {/* <div className=" h-[18.75rem] w-[44vw]  md:flex hidden items-center justify-center">
              <h2>No Active Users</h2>
            </div> */}
            <DashboardGraphs />
          </div>

          {/* <div className="ml-12 w-full md:block hidden h-[18.75rem] w-[44vw]">
            <h1 className="text-xl font-bold my-2">Outlet traffic</h1>
            <LineGraph dataset={dataset2} toggle={true} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
