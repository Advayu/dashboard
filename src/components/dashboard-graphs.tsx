"use client";
import React from "react";
import RedemptionHeatMap from "./IndiaHeatmap";
import { useRedemptionTraffic } from "@/hooks/use-outlet";
import { useSelector } from "react-redux";
import LineGraph from "./ui/lineGraph";
import { ChartBarDefault } from "@/components/charts/bar-chart";
import { useGetOutletRedemptionsByBrandId } from "@/hooks/use-brand";

const DashboardGraphs = () => {
  const brandId = useSelector((state: any) => state.brandUser.brand_id);

  const { data, isLoading } = useGetOutletRedemptionsByBrandId(brandId);
  const { data: redemptionTraffic, isLoading: isLoadingTraffic } =
    useRedemptionTraffic({
      brand_id: brandId,
      fy: "FY 25-26",
    });

  if (isLoadingTraffic) return <div>Loading...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="md:mx-4 space-y-4 ">
      <div>
        <h3 className="text-xl font-bold my-2">Outlet Offer Redemptions</h3>
        <ChartBarDefault rawData={redemptionTraffic} />
      </div>
      <div className=" max-h-[350px] overflow-hidden ">
        <RedemptionHeatMap data={data} />
      </div>
    </div>
  );
};

export default DashboardGraphs;
