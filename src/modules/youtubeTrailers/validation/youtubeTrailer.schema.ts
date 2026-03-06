import { z } from "zod";

export const youtubeTrailerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    url: z.url("Must be a valid URL"),
    duration: z.number().min(1, "Duration must be at least 1 second"),
    channel: z.string().min(1, "Channel is required"),
    movieId: z.string().optional(),
});

export type YoutubeTrailerFormData = z.infer<typeof youtubeTrailerSchema>;
