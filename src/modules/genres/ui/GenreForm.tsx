"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenreFormData, GenreSchema } from "@/modules/genres/validation/genre.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

interface GenreFormProps {
    onSubmit: SubmitHandler<GenreFormData>;
    defaultValues?: GenreFormData;
    isSubmitting?: boolean;
}

export default function GenreForm({
    onSubmit,
    defaultValues,
    isSubmitting,
}: GenreFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<GenreFormData>({
        resolver: zodResolver(GenreSchema),
        defaultValues,
    });
    const { t } = useI18n();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t.genres.saveGenre}>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.genres.genreType}
                </label>
                <input
                    id="type"
                    {...register("type")}
                    aria-required="true"
                    aria-invalid={!!errors.type}
                    aria-describedby={errors.type ? "type-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.genres.placeholder}
                />
                {errors.type && (
                    <p id="type-error" className="text-red-600 text-sm mt-1" role="alert">{errors.type.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                aria-label={isSubmitting ? t.saving : t.genres.saveGenre}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? t.saving : t.genres.saveGenre}
            </button>
        </form>
    );
}
