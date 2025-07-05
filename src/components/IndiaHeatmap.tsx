"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { CircleMarker, Tooltip } from "react-leaflet";

import "leaflet.heat";
import React from "react";

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
  console.log("points", points);
  React.useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 20,
      blur: 20,
      maxZoom: 17,
      minOpacity: 0.4,
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

  const max = Math.max(...safeData.map((d) => d.total_redemptions));
  const maxLog = Math.log10(max + 1);

  const heatPoints: [number, number, number][] = safeData
    .filter((d) => d.lat && d.lng && d.total_redemptions)
    .map((d) => [
      d.lat,
      d.lng,
      d.total_redemptions,
      // Math.min(1, (Math.log10(d.total_redemptions + 1) / maxLog) * 2), // scaled up
    ]);

  return (
    <MapContainer
      keyboard={true}
      center={[22.9734, 78.6569]}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "800px", width: "40vw" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <HeatLayer points={heatPoints} />
      <OutletMarkers data={safeData} />
    </MapContainer>
  );
}
