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
    createOutlet,
  } = useOutletForm();

  return (
    <AddOutletLayout>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleOutletSubmit)}
          className="mt-8 ">
          {/* Outlet Name */}
          {createOutlet.isError && (
            <div className="mb-4 p-3 rounded bg-red-50 border border-red-300 text-sm text-red-700">
              {createOutlet.error?.message ||
                "Something went wrong while saving the outlets. Please try again."}
            </div>
          )}
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
          <div className="fixed  bottom-0 left-0 w-full  px-4 py-3 flex justify-center gap-4 backdrop-blur-sm shadow-md shadow-black-400">
            <Button
              onClick={addNewOutlet}
              type="button"
              variant="outline"
              size="thin"
              className="w-auto">
              + Add Outlet
            </Button>
            <Button
              disabled={fields.length === 0 || createOutlet.isPending}
              type="submit"
              className="w-auto px-6 py-2"
              size="default">
              {createOutlet.isPending
                ? "Creating outlets..."
                : "Create Outlets"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </AddOutletLayout>
  );
};

export default OutletDetails;
