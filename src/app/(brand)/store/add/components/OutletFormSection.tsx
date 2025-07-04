"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFormContext } from "react-hook-form";
import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { DynamicInputList } from "@/components/DynamicInputList";
import WeekdaySelector from "@/components/WeekdaySelector";
import AccessibilityFeaturesSelector from "@/components/AccessibilityFeaturesSelector";
import TimeSelector from "@/components/TimeSelector";
import ImageUploader from "@/components/ImageUploader";
import OutletLocationSection from "./OutletLocationSection";

interface OutletFormSectionProps {
  index: number;
  remove: (index: number) => void;
  value: string;
}

const OutletFormSection = ({
  index,
  remove,
  value,
}: OutletFormSectionProps) => {
  const { register } = useFormContext();

  // times for the outlets
  const times = Array.from({ length: 12 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="font-black text-2xl">
        Outlet #{index + 1}
      </AccordionTrigger>
      <AccordionContent>
        {/* Name */}
        <div className="my-3">
          <Label htmlFor="name">
            Name of the outlet <span className="text-red-500">*</span>
          </Label>
          <Input
            autoFocus
            {...register(`outlet.${index}.name`, { required: true })}
            id="name"
            placeholder="Enter outlet name"
          />
        </div>

        {/* Address */}
        <div className="my-3">
          <Label htmlFor="address">Address</Label>
          <Input
            {...register(`outlet.${index}.address`, { required: true })}
            id="address"
            placeholder="Enter address"
          />
        </div>

        {/* Location */}
        <OutletLocationSection index={index} />

        {/* Neighborhood */}
        <div className="my-3">
          <Label htmlFor="neighborhood">Neighborhood</Label>
          <Input
            {...register(`outlet.${index}.neighborhood`)}
            id="neighborhood"
            placeholder="Enter neighborhood"
          />
        </div>

        {/* Street */}
        <div className="my-3">
          <Label htmlFor="street">Street</Label>
          <Input
            {...register(`outlet.${index}.street`)}
            id="street"
            placeholder="Enter street"
          />
        </div>

        {/* Postal Code */}
        <div className="my-3">
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            {...register(`outlet.${index}.postal_code`, { required: true })}
            id="postal_code"
            placeholder="Enter postal code"
          />
        </div>

        {/* Phone */}
        <div className="my-3">
          <Label htmlFor="manager_phone">Manager Phone</Label>
          <PhoneNumberInput
            {...register(`outlet.${index}.manager_phone`, { required: true })}
            id="manager_phone"
            placeholder="Enter phone number"
          />
        </div>

        {/* Manager Name */}
        <div className="my-3">
          <Label htmlFor="manager_name">Manager Name</Label>
          <Input
            {...register(`outlet.${index}.manager_name`, { required: true })}
            id="manager_name"
            placeholder="Enter name"
          />
        </div>

        {/* Services */}
        <DynamicInputList
          fieldName={`outlet.${index}.services`}
          label="Add services"
          placeholder="Enter a service"
          index={1}
        />

        {/* Amenities */}
        <DynamicInputList
          fieldName={`outlet.${index}.amenities`}
          label="Add amenities"
          placeholder="Enter an amenity"
          index={2}
        />

        {/* Accessibility */}
        <AccessibilityFeaturesSelector
          name={`outlet.${index}.accessibility_features`}
        />

        {/* Timing */}
        <div className="my-6">
          <Label>Outlet Timing</Label>
          <div className="flex space-x-2">
            <TimeSelector
              name={`outlet.${index}.opening_hours`}
              label="Opening Time"
              times={times}
            />
            <TimeSelector
              name={`outlet.${index}.closing_hours`}
              label="Closing Time"
              times={times}
            />
          </div>
        </div>

        {/* Days Open */}
        <WeekdaySelector name={`outlet.${index}.days_open`} />

        {/* Images */}
        <div className="my-3">
          <h4>Upload Outlet Images</h4>
          <ImageUploader name={`outlet.${index}.images`} multiple={true} />
        </div>

        {/* Remove Button */}
        <Button
          onClick={() => remove(index)}
          type="button"
          variant="destructive">
          Remove Outlet
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};

export default OutletFormSection;
