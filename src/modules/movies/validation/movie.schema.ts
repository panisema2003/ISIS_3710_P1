import { z } from "zod";

export const MovieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    poster: z.url("Valid poster URL is required"),
    duration: z.number().positive("Duration must be a positive number").min(1, "Duration must be at least 1 minute"),
    country: z.string().min(1, "Country is required"),
    releaseDate: z.string().min(1, "Release date is required"),
    popularity: z.int().min(0, "Popularity must be at least 0").max(5, "Popularity must be at most 5"),
    directorId: z.string().min(1, "Director is required"),
    genreId: z.string().min(1, "Genre is required"),
    youtubeTrailerId: z.string().min(1, "YouTube trailer is required"),
    actorIds: z.array(z.string()).optional(),
    platformIds: z.array(z.string()).optional(),
});

export type MovieFormData = z.infer<typeof MovieSchema>;
