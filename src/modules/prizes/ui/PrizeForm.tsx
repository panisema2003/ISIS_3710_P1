"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrizeFormData, PrizeSchema } from "@/modules/prizes/validation/prize.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

interface PrizeFormProps {
    onSubmit: SubmitHandler<PrizeFormData>;
    defaultValues?: Partial<PrizeFormData>;
    isSubmitting?: boolean;
}

export default function PrizeForm({
    onSubmit,
    defaultValues,
    isSubmitting,
}: PrizeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PrizeFormData>({
        resolver: zodResolver(PrizeSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            status: "nominated",
            ...defaultValues,
        },
    });
    const { t } = useI18n();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t.prizesSection.savePrize}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.prizesSection.prizeName}
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.prizesSection.namePlaceholder}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && (
                    <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.prizesSection.category}
                </label>
                <input
                    id="category"
                    {...register("category")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.prizesSection.categoryPlaceholder}
                    aria-required="true"
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? "category-error" : undefined}
                />
                {errors.category && (
                    <p id="category-error" className="text-red-600 text-sm mt-1" role="alert">{errors.category.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.prizesSection.year}
                </label>
                <input
                    id="year"
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={1900}
                    max={2100}
                    aria-required="true"
                    aria-invalid={!!errors.year}
                    aria-describedby={errors.year ? "year-error" : undefined}
                />
                {errors.year && (
                    <p id="year-error" className="text-red-600 text-sm mt-1" role="alert">{errors.year.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.prizesSection.status}
                </label>
                <select
                    id="status"
                    {...register("status")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-required="true"
                >
                    <option value="nominated">{t.prizesSection.nominated}</option>
                    <option value="won">{t.prizesSection.won}</option>
                </select>
                {errors.status && (
                    <p className="text-red-600 text-sm mt-1" role="alert">{errors.status.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
                aria-busy={isSubmitting}
            >
                {isSubmitting ? t.saving : t.prizesSection.savePrize}
            </button>
        </form>
    );
}
