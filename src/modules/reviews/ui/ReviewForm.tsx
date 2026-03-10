"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/modules/reviews/validation/review.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

interface ReviewFormProps {
    onSubmit: (data: ReviewFormData) => Promise<void>;
    submitLabel: string;
    defaultValues?: Partial<ReviewFormData>;
}

export default function ReviewForm({
    onSubmit,
    submitLabel,
    defaultValues,
}: ReviewFormProps) {
    const { t } = useI18n();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl" aria-label={t.reviews.title}>
            <div>
                <label htmlFor="creator" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.reviews.yourName} *
                </label>
                <input
                    type="text"
                    id="creator"
                    {...register("creator")}
                    aria-required="true"
                    aria-invalid={!!errors.creator}
                    aria-describedby={errors.creator ? "creator-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.reviews.namePlaceholder}
                />
                {errors.creator && (
                    <p id="creator-error" className="mt-1 text-sm text-red-600" role="alert">{errors.creator.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.reviews.score} *
                </label>
                <input
                    type="number"
                    id="score"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register("score", { valueAsNumber: true })}
                    aria-required="true"
                    aria-invalid={!!errors.score}
                    aria-describedby={errors.score ? "score-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.reviews.scorePlaceholder}
                />
                {errors.score && (
                    <p id="score-error" className="mt-1 text-sm text-red-600" role="alert">{errors.score.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.reviews.reviewText} *
                </label>
                <textarea
                    id="text"
                    rows={4}
                    {...register("text")}
                    aria-required="true"
                    aria-invalid={!!errors.text}
                    aria-describedby={errors.text ? "text-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.reviews.textPlaceholder}
                />
                {errors.text && (
                    <p id="text-error" className="mt-1 text-sm text-red-600" role="alert">{errors.text.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? t.saving : submitLabel}
            </button>
        </form>
    );
}
