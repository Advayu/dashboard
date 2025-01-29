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

// Fixing the default marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Set up default icon for Leaflet markers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  lat: number;
  long: number;
  onLocationChange: (coords: [number, number]) => void; // Callback to
  // update global state
  // updateLocationChange: (coords: [number, number]) => void;
}

const Map: React.FC<MapProps> = ({
  lat,
  long,
  onLocationChange,
  // updateLocationChange,
}) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    lat,
    long,
  ]);

  useEffect(() => {
    console.log("lat in component:", lat, "long:", long);
    setMarkerPosition([lat, long]); // Update marker position when props change
    // updateLocationChange([lat, long]);
  }, [lat]);

  return (
    <div className="w-full h-[200px] md:h-[300px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={markerPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FocusMap position={markerPosition} />{" "}
        {/* Add the FocusMap component */}
        <RelocateMarker position={markerPosition} />
        <MapClickHandler
          setMarkerPosition={setMarkerPosition}
          onLocationChange={onLocationChange}
          // updateLocationChange={updateLocationChange}
        />
      </MapContainer>
    </div>
  );
};

// Component to handle marker relocation
const RelocateMarker: React.FC<{ position: [number, number] }> = ({
  position,
}) => {
  console.log("position in map component:", position);
  return (
    <Marker position={position}>
      <Popup>
        Selected Location: {position[0]}, {position[1]}
      </Popup>
    </Marker>
  );
};

// Component to handle map click events
const MapClickHandler: React.FC<{
  setMarkerPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  onLocationChange: (coords: [number, number]) => void;
  // updateLocationChange: (coords: [number, number]) => void;
}> = ({ setMarkerPosition, onLocationChange }) => {
  useMapEvents({
    click(e) {
      const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
      setMarkerPosition(coords); // Update marker position
      onLocationChange(coords); // Update global state
      // updateLocationChange(coords);
      console.log("Selected Coordinates:", coords); // Log clicked coordinates
    },
  });
  return null;
};

const FocusMap: React.FC<{ position: [number, number] }> = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, map.getZoom()); // Recenter the map to the new position
  }, [position, map]);

  return null; // This component doesn't render anything visible
};

export default Map;
