"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DirectorFormData, DirectorSchema } from "@/modules/directors/validation/director.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

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
    const { t } = useI18n();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t.directors.saveDirector}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.directors.directorName}
                </label>
                <input
                    id="name"
                    {...register("name")}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="photo" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.directors.photoUrl}
                </label>
                <input
                    id="photo"
                    type="url"
                    {...register("photo")}
                    aria-required="true"
                    aria-invalid={!!errors.photo}
                    aria-describedby={errors.photo ? "photo-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                />
                {errors.photo && (
                    <p id="photo-error" className="text-red-600 text-sm mt-1" role="alert">{errors.photo.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="nationality" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.directors.nationality}
                </label>
                <input
                    id="nationality"
                    {...register("nationality")}
                    aria-required="true"
                    aria-invalid={!!errors.nationality}
                    aria-describedby={errors.nationality ? "nationality-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.nationality && (
                    <p id="nationality-error" className="text-red-600 text-sm mt-1" role="alert">{errors.nationality.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.directors.birthDate}
                </label>
                <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    aria-required="true"
                    aria-invalid={!!errors.birthDate}
                    aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.birthDate && (
                    <p id="birthDate-error" className="text-red-600 text-sm mt-1" role="alert">{errors.birthDate.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="biography" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.directors.biography}
                </label>
                <textarea
                    id="biography"
                    {...register("biography")}
                    aria-required="true"
                    aria-invalid={!!errors.biography}
                    aria-describedby={errors.biography ? "biography-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                />
                {errors.biography && (
                    <p id="biography-error" className="text-red-600 text-sm mt-1" role="alert">{errors.biography.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                aria-label={isSubmitting ? t.saving : t.directors.saveDirector}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? t.saving : t.directors.saveDirector}
            </button>
        </form>
    );
}
