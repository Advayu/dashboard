"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";

import "leaflet.heat";
import React, { useEffect } from "react";

function FitBounds({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const latlngs = points.map(([lat, lng]) => [lat, lng]) as [
      number,
      number,
    ][];
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, points]);

  return null;
}

function OutletMarkers({ data }: { data: any[] }) {
  return (
    <>
      {data.map((d, idx) => {
        if (!d.lat || !d.lng) return null;

        return (
          <CircleMarker
            key={`${d.outlet_id}-${idx}`}
            center={[d.lat, d.lng]}
            radius={6}
            pathOptions={{
              color: "#007BFF",
              fillColor: "#007BFF",
              fillOpacity: 0.6,
            }}>
            <Tooltip
              direction="top"
              offset={[0, -8]}
              opacity={1}
              permanent={false}>
              <div>
                <strong>{d.outlet_name}</strong>
                <br />
                Redemptions: {d.total_redemptions.toLocaleString()}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

// Extend Leaflet's type definitions to include heatLayer
declare module "leaflet" {
  export function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: { [key: number]: string };
    }
  ): L.Layer;
}

function HeatLayer({ points }: { points: Array<[number, number, number]> }) {
  const map = useMap();
  React.useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.8,
      gradient: {
        0.0: "#daeeef", // very light blue
        0.4: "#a6d8dc", // soft teal
        0.6: "#5fb7bf", // teal
        0.8: "#2e8b99", // stronger blue
        1.0: "#0d4d57", // dark teal/navy
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
export default function RedemptionHeatMap({ data = [] }: { data?: any[] }) {
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return <p>No data available for heatmap.</p>;
  }

  const max = Math.max(...safeData.map((d) => d.total_redemptions || 0)) || 1;
  const maxLog = Math.log10(max + 1);

  const heatPoints: [number, number, number][] = safeData
    .filter((d) => d.latitude && d.longitude && d.total_redemptions)
    .map((d) => [
      parseFloat(d.latitude),
      parseFloat(d.longitude),
      Math.max(Math.log10(d.total_redemptions + 1) / maxLog, 0.1), // scaled and min 0.1
    ]);

  return (
    <MapContainer
      keyboard={true}
      center={[22.6, 80.9629]}
      zoom={3.5}
      scrollWheelZoom={true}
      style={{ height: "360px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={heatPoints} />
      <OutletMarkers data={safeData} />
      <FitBounds points={heatPoints} />
    </MapContainer>
  );
}
