"use server";
import React from "react";
import Dashboard from "@/components/layout/dashboard";
import NotificationCard from "@/components/cards/notificationCard";

// import Map from "@/components/ui/Map"
import LineGraph from "@/components/ui/lineGraph"; //to show the outlet traffic
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
// TODO: Replace this with actual data from the backend
import { dataset2 } from "@/components/utils/dataset";
import { notification as dummyNotification } from "@/dummydata/notification";
import { decodeJWT } from "@/lib/decodeJWT";
import RedemptionHeatMap from "@/components/IndiaHeatmap";

export default async function Page() {
  // getting decoded jwt token from cookies to get details like {email, brand_id}
  const data = await decodeJWT();
  const data12 = [
    // 🟠 Cluster 1 - Bangalore (High activity)
    {
      outlet_id: "1",
      outlet_name: "Outlet A",
      lat: 12.9784,
      lng: 77.6408,
      total_redemptions: 40,
    },
    {
      outlet_id: "2",
      outlet_name: "Outlet B",
      lat: 12.9786,
      lng: 77.6412,
      total_redemptions: 3,
    },
    {
      outlet_id: "3",
      outlet_name: "Outlet C",
      lat: 12.9782,
      lng: 77.6406,
      total_redemptions: 2,
    },
    {
      outlet_id: "4",
      outlet_name: "Outlet D",
      lat: 12.9789,
      lng: 77.6409,
      total_redemptions: 10,
    },

    {
      outlet_id: "5",
      outlet_name: "Outlet E",
      lat: 27.553,
      lng: 76.6346,
      total_redemptions: 100000,
    },
    {
      outlet_id: "6",
      outlet_name: "Outlet F",
      lat: 27.5532,
      lng: 76.6349,
      total_redemptions: 200000,
    },
    {
      outlet_id: "7",
      outlet_name: "Outlet G",
      lat: 27.5534,
      lng: 76.6352,
      total_redemptions: 150000,
    },
    {
      outlet_id: "8",
      outlet_name: "Outlet H",
      lat: 27.5528,
      lng: 76.6343,
      total_redemptions: 90000,
    },
    {
      outlet_id: "8",
      outlet_name: "Outlet H",
      lat: 27.5528,
      lng: 76.6343,
      total_redemptions: 90000,
    },
    {
      outlet_id: "8",
      outlet_name: "Outlet H",
      lat: 27.5528,
      lng: 76.6343,
      total_redemptions: 90000,
    },
  ];

  return (
    <div className="md:w-[93%] w-full md:mx-0 mx-4">
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
            <RedemptionHeatMap data={data12} />
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
