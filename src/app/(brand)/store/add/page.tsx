"use client";
import { Button } from "@/components/ui/button";
import { FormProvider } from "react-hook-form";

import AddOutletLayout from "./components/add-outlet-layout";
import OutletFormSection from "./components/OutletFormSection";
import { useOutletForm } from "./hooks/useOutletForm";
import { Accordion } from "@/components/ui/accordion";

const OutletDetails = () => {
  const {
    methods,
    fields,
    remove,
    addNewOutlet,
    handleOutletSubmit,
    openAccordionValue,
    setOpenAccordionValue,
    errors,
    watch,
  } = useOutletForm();

  return (
    <AddOutletLayout>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleOutletSubmit)}
          className="mt-8">
          {/* Outlet Name */}

          <Accordion
            type="single"
            collapsible
            value={openAccordionValue}
            onValueChange={setOpenAccordionValue}
            className="space-y-4">
            {fields.map((field, index) => (
              <OutletFormSection
                key={field.id}
                index={index}
                remove={remove}
                value={`outlet-${index}`}
                errors={errors}
                watch={watch}
              />
            ))}
          </Accordion>
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
              className="w-72 w-full md:w-auto px-6 py-2 "
              size="default">
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </AddOutletLayout>
  );
};

export default OutletDetails;
