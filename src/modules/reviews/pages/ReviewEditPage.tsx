"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReviewById, updateReview } from "@/modules/reviews/services/review.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import ReviewForm from "@/modules/reviews/ui/ReviewForm";
import { ReviewFormData } from "@/modules/reviews/validation/review.schema";
import { Review } from "@/modules/reviews/types/review.type";
import { useI18n } from "@/shared/i18n/I18nContext";

interface ReviewEditPageProps {
    movieId: string;
    reviewId: string;
}

export default function ReviewEditPage({ movieId, reviewId }: ReviewEditPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();
    
    const [review, setReview] = useState<Review | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReview = async () => {
            try {
                setIsLoading(true);
                const data = await fetchReviewById(movieId, reviewId);
                setReview(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : t.reviews.createError);
            } finally {
                setIsLoading(false);
            }
        };
        loadReview();
    }, [movieId, reviewId]);

    const handleSubmit = async (data: ReviewFormData) => {
        await updateReview(movieId, reviewId, data);
        showNotification(t.reviews.updatedSuccess, "success");
        router.push(`/movies/${movieId}/reviews`);
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error || !review) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error || t.reviews.movieNotFound}</div>;
    }

    const defaultValues: Partial<ReviewFormData> = {
        text: review.text,
        score: review.score,
        creator: review.creator,
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="edit-review-title">
            <h1 id="edit-review-title" className="text-3xl font-bold mb-6">{t.reviews.editReview}</h1>
            <ReviewForm
                onSubmit={handleSubmit}
                submitLabel={t.reviews.updateReview}
                defaultValues={defaultValues}
            />
        </section>
    );
}
