"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchReviewById, updateReview } from "@/modules/reviews/services/review.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import ReviewForm from "@/modules/reviews/ui/ReviewForm";
import { ReviewFormData } from "@/modules/reviews/validation/review.schema";
import { Review } from "@/modules/reviews/types/review.type";

interface ReviewEditPageProps {
    movieId: string;
    reviewId: string;
}

export default function ReviewEditPage({ movieId, reviewId }: ReviewEditPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    
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
                setError(err instanceof Error ? err.message : "Failed to load review");
            } finally {
                setIsLoading(false);
            }
        };
        loadReview();
    }, [movieId, reviewId]);

    const handleSubmit = async (data: ReviewFormData) => {
        await updateReview(movieId, reviewId, data);
        showNotification("Review updated successfully!", "success");
        router.push(`/movies/${movieId}/reviews`);
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error || !review) {
        return <div className="text-center p-8 text-red-500">Error: {error || "Review not found"}</div>;
    }

    const defaultValues: Partial<ReviewFormData> = {
        text: review.text,
        score: review.score,
        creator: review.creator,
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Review</h1>
            <ReviewForm
                onSubmit={handleSubmit}
                submitLabel="Update Review"
                defaultValues={defaultValues}
            />
        </div>
    );
}
