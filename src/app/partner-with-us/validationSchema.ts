// src/schemas/brandSchema.ts
import { z } from 'zod';

export const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required."),
  industry: z.string().min(1, "Please select an industry."),
  category: z.string().min(1, "Please select a category."),
  ageGroup: z.array(z.string()).nonempty("Please select at least one age group."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  tagline: z.string().min(5, "Tagline must be at least 5 characters."),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits."),
  email: z.string().email("Invalid email address."),
  gstNumber: z.string().optional(),
  fssaiNumber: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL."),
  bannerImageUrl: z.string().url("Invalid banner image URL."),
  websiteUrl: z.string().url("Invalid website URL."),
});

export type BrandDetail = z.infer<typeof brandSchema>;