import { z } from "zod";

export const DirectorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    photo: z.url("Photo URL is required"),
    nationality: z.string().min(2, "Nationality is required"),
    birthDate: z.string().min(1, "Birth date is required"),
    biography: z.string().min(1, "Biography is required"),
});

// create a TS type from the schema to use in component
export type DirectorFormData = z.infer<typeof DirectorSchema>;
