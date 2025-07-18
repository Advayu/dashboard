"use client";

import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { outletFormSchema, outletSchema } from "@/schemas/outlet.schema";
import { toast } from "@/hooks/use-toast";
import { useImageUpload } from "@/hooks/use-image";
import { LAMBDA_URL, OUTLET_BUCKET_NAME } from "@/utils/constants";
import { useCreateOutlet } from "@/hooks/use-outlet";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";

type OutletData = z.infer<typeof outletFormSchema>["outlet"][number];

const outletData: OutletData = {
    name: "",
    address: "",
    neighborhood: "",
    street: "",
    postal_code: "",
    manager_phone: "",
    manager_name: "",
    services: [],
    amenities: [],
    accessibility_features: {},
    opening_hours: "",
    closed_days: "",
    days_open: [],
    images: [],
    location: {
        lat: 12.9784,
        lng: 77.6408,
    },
};

export const useOutletForm = () => {
    const router = useRouter();
    const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>("outlet-0");


    const uploadImageToBucket = useImageUpload(

        OUTLET_BUCKET_NAME
    );
    // hook that call api to create outlet
    const createOutlet = useCreateOutlet();

    // redux form hook
    const methods = useForm({
        resolver: zodResolver(outletFormSchema),
        defaultValues: { outlet: [outletData] },
    });

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = methods;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "outlet",
    });

    const brandUserStr = localStorage.getItem("persist:brandUser");
    const brand_id = brandUserStr
        ? JSON.parse(brandUserStr)?.brand_id
        : undefined;

    const handleOutletSubmit: SubmitHandler<any> = async (data) => {
        setOpenAccordionValue("");
        const outlets = data.outlet;
        console.log("outlets", outlets);

        if (!brand_id) {
            toast({
                variant: "destructive",
                title: "Missing Brand ID",
                description: "Please log in or check your session.",
            });
            return;
        }

        try {
            const outletPromises = outlets.map(async (outlet: any) => {
                const results = await Promise.all(
                    (outlet.images || []).map((image: File) =>
                        uploadImageToBucket.mutateAsync(image)
                    )
                );
                console.log("results", results);
                outlet.images = results.map((r) => r.fileKey);
                console.log("outlet", outlet);
                return createOutlet.mutateAsync({ brand_id, newOutlet: outlet });
            });

            await Promise.all(outletPromises);

            toast({
                variant: "default",
                title: "Success",
                description: "All outlets created successfully!",
            });
            router.push("/store/all");
        } catch (error) {
            console.error("Error creating outlets:", error);
            toast({
                variant: "destructive",
                title: "Upload Failed",
                description: String(error),
            });
        }
    };

    const addNewOutlet = async () => {

        const currentOutlets = watch("outlet");
        const lastIndex = currentOutlets?.length - 1;

        if (lastIndex >= 0) {
            const isValid = await trigger(`outlet.${lastIndex}`);
            if (!isValid) {

                return;
            }
        }

        append({ ...outletData });

        // Set the accordion to open the new one
        setOpenAccordionValue(`outlet-${fields.length}`);

    };

    return {
        methods,
        fields,
        append,
        remove,
        addNewOutlet,
        handleOutletSubmit,
        openAccordionValue,
        setOpenAccordionValue,
        errors,
        watch,
        createOutlet
    };
};
