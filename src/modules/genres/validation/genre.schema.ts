import { z } from "zod";

export const GenreSchema = z.object({
    type: z.string().min(1, "Genre type is required"),
});

export type GenreFormData = z.infer<typeof GenreSchema>;
