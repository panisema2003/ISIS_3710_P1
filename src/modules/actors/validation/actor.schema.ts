import { z } from "zod";

export const ActorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    photo: z.url().min(1, "Photo URL is required"),
    nationality: z.string().min(2, "Nationality is required"),
    birthDate: z.string().min(1, "Birth date is required"),
    biography: z.string().min(1, "Biography is required"),

    movieIds: z.array(z.string()).optional() // Optional array of movie IDssss

});

// create a TS type from the schema to use in component
export type ActorFormData = z.infer<typeof ActorSchema>;