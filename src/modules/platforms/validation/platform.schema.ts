import { z } from "zod";

export const PlatformSchema = z.object({
    name: z.string().min(1, "Platform name is required"),
    url: z.url("Valid URL is required"),
});

export type PlatformFormData = z.infer<typeof PlatformSchema>;
