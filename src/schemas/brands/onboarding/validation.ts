import z from "zod";

export const brandDetailsSchema = z.object({
    name: z.string().min(1, "Brand name is required"),
    industry: z.string().min(1, "Industry is required"),
    category: z.string().min(1, "Category is required").optional(),
    ageGroup: z
        .array(z.string())
        .min(1, "At least one age group should be selected"),
    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    tagline: z
        .string()
        .max(100, "Tagline cannot exceed 100 characters")
        .optional(),
    phoneNumber: z
        .string()
        .regex(/^\d{10}$/, "Phone number must be 10 digits")
        .optional(),
    alternateNumber: z
        .string()
        .regex(/^\d{10}$/, "Alternate number must be 10 digits")
        .optional(),
    email: z.string().email("Invalid email address").optional(),
    gstNumber: z
        .string()
        .min(15, "GST number must be 15 characters")
        .optional(),
    fssaiNumber: z.string().optional(),
    imageUrl: z.string().url("Invalid URL format").optional(),
    bannerImageUrl: z.string().url("Invalid URL format").optional(),
    websiteUrl: z.string().url("Invalid URL format").optional(),
});