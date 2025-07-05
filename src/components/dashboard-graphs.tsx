"use client";
import React from "react";
import RedemptionHeatMap from "./IndiaHeatmap";
import { useGetOutletRedemptionsByBrandId } from "@/hooks/use-brand";
import { useSelector } from "react-redux";

const DashboardGraphs = () => {
  const brandId = useSelector((state: any) => state.brandUser.brand_id);

  const { data } = useGetOutletRedemptionsByBrandId(brandId);

  return (
    <div>
      <RedemptionHeatMap data={data} />
    </div>
  );
};

export default DashboardGraphs;
