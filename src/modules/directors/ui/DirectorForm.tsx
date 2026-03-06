"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DirectorFormData, DirectorSchema } from "@/modules/directors/validation/director.schema";

interface DirectorFormProps {
    onSubmit: SubmitHandler<DirectorFormData>;
    defaultValues?: DirectorFormData;
    isSubmitting?: boolean;
}

export default function DirectorForm({
    onSubmit,
    defaultValues,
    isSubmitting,
}: DirectorFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<DirectorFormData>({
        resolver: zodResolver(DirectorSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Director Name
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-800 mb-1">
                    Photo URL
                </label>
                <input
                    id="photo"
                    type="url"
                    {...register("photo")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                />
                {errors.photo && (
                    <p className="text-red-600 text-sm mt-1">{errors.photo.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-800 mb-1">
                    Nationality
                </label>
                <input
                    id="nationality"
                    {...register("nationality")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.nationality && (
                    <p className="text-red-600 text-sm mt-1">{errors.nationality.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-800 mb-1">
                    Birth Date
                </label>
                <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.birthDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.birthDate.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="biography" className="block text-sm font-medium text-gray-800 mb-1">
                    Biography
                </label>
                <textarea
                    id="biography"
                    {...register("biography")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                />
                {errors.biography && (
                    <p className="text-red-600 text-sm mt-1">{errors.biography.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? "Saving..." : "Save Director"}
            </button>
        </form>
    );
}
