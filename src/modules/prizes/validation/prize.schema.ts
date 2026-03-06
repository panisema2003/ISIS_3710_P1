import { z } from "zod";

export const PrizeSchema = z.object({
    name: z.string().min(1, "Prize name is required"),
    category: z.string().min(1, "Category is required"),
    year: z.number().int().min(1900, "Year must be 1900 or later").max(2100, "Year must be 2100 or earlier"),
    status: z.enum(["won", "nominated"], { 
        message: "Status must be 'won' or 'nominated'"
    }),
});

export type PrizeFormData = z.infer<typeof PrizeSchema>;
