"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/modules/reviews/validation/review.schema";

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
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <div>
                <label htmlFor="creator" className="block text-sm font-medium text-gray-800 mb-1">
                    Your Name *
                </label>
                <input
                    type="text"
                    id="creator"
                    {...register("creator")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                />
                {errors.creator && (
                    <p className="mt-1 text-sm text-red-600">{errors.creator.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-800 mb-1">
                    Score (0-5) *
                </label>
                <input
                    type="number"
                    id="score"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register("score", { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="4.5"
                />
                {errors.score && (
                    <p className="mt-1 text-sm text-red-600">{errors.score.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-800 mb-1">
                    Review Text *
                </label>
                <textarea
                    id="text"
                    rows={4}
                    {...register("text")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write your review..."
                />
                {errors.text && (
                    <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}
