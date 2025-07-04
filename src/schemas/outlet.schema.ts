// src/schemas/outlet.schema.ts
import { z } from "zod";

export const outletSchema = z.object({
    name: z.string().min(1, "Name is required"), // required
    address: z.string(),
    neighborhood: z.string().optional(),
    street: z.string().optional(),
    postal_code: z.string().optional(),
    manager_phone: z.string().optional(),
    manager_name: z.string().optional(),
    services: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    accessibility_features: z.record(z.string(), z.boolean(), {
        message: "Accessibility features are required"
    }).optional(),
    opening_hours: z.string().optional(),
    closing_hours: z.string().optional(),
    closed_days: z.string().optional(),
    days_open: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File)).optional(),
    location: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
})

export const outletFormSchema = z.object({
    outlet: z.array(outletSchema),
});

export type Outlet = z.infer<typeof outletSchema>;