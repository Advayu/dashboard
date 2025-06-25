import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

interface Location {
  lat: number;
  lng: number;
}

interface GetLocationButtonProps {
  name: string; // Form field name, e.g., "location"
}

const GetLocationButton: React.FC<GetLocationButtonProps> = ({ name }) => {
  const { setValue } = useFormContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoading(false);
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("location", location);
        setValue(name, location); // update form field with location
      },
      (err) => {
        setLoading(false);
        setError(`Failed to get location: ${err.message}`);
      }
    );
  };

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={handleGetLocation}
        disabled={loading}
        className="bg-blueTilt hover:bg-blueTilt/70 text-white px-4 py-1 rounded">
        {loading ? "Locating..." : "Get My Location"}
      </button>
      {error && <p className="mt-2 text-red-500">⚠️ {error}</p>}
    </div>
  );
};

export default GetLocationButton;
