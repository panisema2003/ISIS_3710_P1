"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlatformFormData, PlatformSchema } from "@/modules/platforms/validation/platform.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

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
    const { t } = useI18n();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t.platforms.savePlatform}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.platforms.platformName}
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.platforms.namePlaceholder}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.platforms.platformUrl}
                </label>
                <input
                    id="url"
                    type="url"
                    {...register("url")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.platforms.urlPlaceholder}
                    aria-required="true"
                    aria-invalid={!!errors.url}
                    aria-describedby={errors.url ? "url-error" : undefined}
                />
                {errors.url && (
                    <p id="url-error" className="text-red-600 text-sm mt-1" role="alert">{errors.url.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
                aria-busy={isSubmitting}
            >
                {isSubmitting ? t.saving : t.platforms.savePlatform}
            </button>
        </form>
    );
}
