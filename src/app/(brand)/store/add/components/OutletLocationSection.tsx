// components/OutletLocationSection.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Map from "@/components/ui/Map";
import GetLocationButton from "@/components/GetLocationButton";
import { useFormContext, useWatch, useController } from "react-hook-form";

interface OutletLocationSectionProps {
  index: number;
}

const OutletLocationSection = ({ index }: OutletLocationSectionProps) => {
  const { control, setValue } = useFormContext();

  // Watch the location for this outlet
  const location = useWatch({
    control,
    name: `outlet.${index}.location`,
  });

  const defaultCoords = { lat: 12.9784, lng: 77.6408 };
  const currentCoords = location || defaultCoords;

  const handleLocationChange = ([lat, lng]: [number, number]) => {
    setValue(`outlet.${index}.location`, { lat, lng });
  };

  return (
    <div className="my-4">
      <Label className="text-base md:text-lg font-bold" htmlFor="location">
        Locate on the map
      </Label>
      <div className="flex items-center gap-2 flex-row ">
        <Input
          type="text"
          readOnly
          value={`${currentCoords.lat}, ${currentCoords.lng}`}
          className="w-[50%]"
          placeholder="Use map/button to locate location"
        />
        <GetLocationButton name={`outlet.${index}.location`} />
      </div>
      <Map
        lat={currentCoords.lat}
        long={currentCoords.lng}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
};

export default OutletLocationSection;
