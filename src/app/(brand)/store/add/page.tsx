"use client";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";

import AddOutletLayout from "./components/add-outlet-layout";
import OutletFormSection from "./components/OutletFormSection";
import { useOutletForm } from "./hooks/useOutletForm";

const OutletDetails = () => {
  const {
    methods,
    fields,
    append,
    remove,
    addNewOutlet,
    handleOutletSubmit,
    openAccordionIndex,
    setOpenAccordionIndex,
  } = useOutletForm();

  return (
    <AddOutletLayout>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleOutletSubmit)}
          className="mt-8">
          {/* Outlet Name */}

          {fields.map((field, index) => (
            <OutletFormSection
              key={field.id}
              index={index}
              remove={remove}
              isOpen={index === openAccordionIndex}
              onOpen={() => setOpenAccordionIndex(index)}
            />
          ))}

          <Button
            onClick={addNewOutlet}
            type="button"
            variant="outline"
            size="thin"
            className="mt-3 w-full md:w-auto">
            + Add Outlet
          </Button>
          {/* Navigation Buttons */}
          <div className="relative group inline-block w-full mt-4">
            <Button
              disabled={fields.length === 0}
              type="submit"
              className="w-28 w-full md:w-auto"
              size="thin">
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </AddOutletLayout>
  );
};

export default OutletDetails;
