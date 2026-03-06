import { z } from "zod";

export const reviewSchema = z.object({
    text: z.string().min(1, "Review text is required"),
    score: z.number().min(0, "Score must be at least 0").max(5, "Score must be at most 5"),
    creator: z.string().min(1, "Creator is required"),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;
