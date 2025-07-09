
import { z } from "zod";
export const offerSchema = z.object({
    title: z.string(),
    discount_type: z.enum(["PERCENTAGE", "ABSOLUTE"]),
    discount_percent: z.coerce.number().nonnegative().optional(),
    discount_value: z.coerce.number().nonnegative().optional(),
    min_order_value: z.coerce.number().nonnegative().optional(),
    max_discount_value: z.coerce.number().nonnegative().optional(),
    total_limit: z.coerce.number().nonnegative().optional(),
    status: z.enum(["Active", "Inactive"]),
    start_date: z.coerce.date(), // could refine to date if needed
    end_date: z.coerce.date(),
    applicable_days: z.array(
        z.enum([
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ])
    ),
});