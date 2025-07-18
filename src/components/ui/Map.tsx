"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon issue in Next.js
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: typeof icon === "string" ? icon : icon.src,
  shadowUrl: typeof iconShadow === "string" ? iconShadow : iconShadow.src,
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  lat: number;
  long: number;
  onLocationChange: (coords: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({ lat = 0, long = 0, onLocationChange }) => {
const validLat = Number(lat) || 0;
const validLong = Number(long) || 0;


  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    validLat,
    validLong,
  ]);


  useEffect(() => {
    setMarkerPosition([validLat, validLong]);
  }, [validLat, validLong]);

  return (
    <div className="w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={markerPosition}
        zoom={15}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FocusMap position={markerPosition} />
        <RelocateMarker position={markerPosition} />
        <MapClickHandler
          setMarkerPosition={setMarkerPosition}
          onLocationChange={onLocationChange}
        />
      </MapContainer>
    </div>
  );
};

// 📍 Marker that updates with the state
const RelocateMarker: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  return (
    <Marker position={position}>
      <Popup>
        Selected Location: <br />
        {position[0]}, {position[1]}
      </Popup>
    </Marker>
  );
};

// 🎯 Handles click events on map to set new position
const MapClickHandler: React.FC<{
  setMarkerPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  onLocationChange: (coords: [number, number]) => void;
}> = ({ setMarkerPosition, onLocationChange }) => {
  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(coords);
      onLocationChange(coords);
    },
  });
  return null;
};

const FocusMap: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (
      !position ||
      position.some((coord) => typeof coord !== "number" || isNaN(coord))
    )
      return;

    map.setView(position, map.getZoom());
  }, [position, map]);

  return null;
};

export default Map;
