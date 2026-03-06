"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlatformFormData, PlatformSchema } from "@/modules/platforms/validation/platform.schema";

interface PlatformFormProps {
    onSubmit: SubmitHandler<PlatformFormData>;
    defaultValues?: PlatformFormData;
    isSubmitting?: boolean;
}

export default function PlatformForm({
    onSubmit,
    defaultValues,
    isSubmitting,
}: PlatformFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PlatformFormData>({
        resolver: zodResolver(PlatformSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Platform Name
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Netflix, Amazon Prime"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-800 mb-1">
                    Platform URL
                </label>
                <input
                    id="url"
                    type="url"
                    {...register("url")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://www.netflix.com"
                />
                {errors.url && (
                    <p className="text-red-600 text-sm mt-1">{errors.url.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? "Saving..." : "Save Platform"}
            </button>
        </form>
    );
}
