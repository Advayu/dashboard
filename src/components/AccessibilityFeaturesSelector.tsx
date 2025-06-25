import React from "react";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface AccessibilityFeaturesSelectorProps {
  name: string; // Field name in the form
}

const AccessibilityFeaturesSelector: React.FC<
  AccessibilityFeaturesSelectorProps
> = ({ name }) => {
  const { getValues, setValue, watch } = useFormContext(); // Access form context
  const selectedFeatures = watch(name) || {}; // Watch the current value of the field

  const areAllFeaturesSelected =
    Object.keys(selectedFeatures).length > 0 &&
    Object.values(selectedFeatures).every((value) => value);

  const handleToggleFeature = (feature: string) => {
    const currentValue = getValues(name) || {};
    setValue(name, {
      ...currentValue,
      [feature]: !currentValue[feature],
    });
  };

  const features = [
    "wheelchair access",
    "braille menu",
    "hearing assist",
    "reserved seating",
  ];

  const handleToggleAllFeatures = () => {
    const newValue = !areAllFeaturesSelected;
    const updatedFeatures = features.reduce(
      (acc, feature) => ({ ...acc, [feature]: newValue }),
      {}
    );
    setValue(name, updatedFeatures);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Accessibility Features</h2>
      <Button
        type="button"
        onClick={handleToggleAllFeatures}
        size={"thin"}
        className={`mt-4 ${
          areAllFeaturesSelected
            ? "bg-red-500 text-white"
            : "bg-blueTilt text-white"
        }`}>
        {areAllFeaturesSelected ? "Deselect All" : "Select All"}
      </Button>
      <div className="mt-2">
        {features.map((feature) => (
          <div key={feature} className="flex items-center space-x-4 my-2">
            <Checkbox
              checked={selectedFeatures[feature] || false}
              onCheckedChange={() => handleToggleFeature(feature)}
              aria-checked={selectedFeatures[feature] ? "true" : "false"} // aria-checked for accessibility
              className=""
            />
            <label className="capitalize">{feature.replace("_", " ")}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessibilityFeaturesSelector;
