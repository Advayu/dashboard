import z from "zod";

export const brandDetailsSchema = z.object({
    name: z.string().min(1, "Brand name is required"),
    category_name: z.string().min(1, "Industry is required"),
    subcategories: z.string().min(1, "sub industry is required"),

    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
    email: z.string().email("Invalid email address").optional(),

    imageUrl: z.string().url("Invalid URL format").optional(),
    bannerImageUrl: z.string().url("Invalid URL format").optional(),
    websiteUrl: z.string().url("Invalid URL format").optional(),
});