"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useReviews } from "@/modules/reviews/hooks/useReviews";
import { Review } from "@/modules/reviews/types/review.type";
import { deleteReview } from "@/modules/reviews/services/review.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import Modal from "@/shared/ui/Modal";

interface MovieReviewsPageProps {
    movieId: string;
    movieTitle?: string;
}

export default function MovieReviewsPage({ movieId, movieTitle }: MovieReviewsPageProps) {
    const { reviews, isLoading, error } = useReviews(movieId);
    const router = useRouter();
    const { showNotification } = useNotificationStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleReviewClick = (review: Review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReview(null);
    }

    const handleEdit = () => {
        if (selectedReview) {
            router.push(`/movies/${movieId}/reviews/${selectedReview.id}/edit`); // Just like the backend path
        }
    };

    const handleDelete = async () => {
        if (!selectedReview) return;
        
        if (!confirm(`Are you sure you want to delete this review?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteReview(movieId, selectedReview.id);
            showNotification("Review deleted successfully", "success");
            handleCloseModal();
            router.refresh();
            window.location.reload();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : "Failed to delete review", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderStars = (score: number) => {
        const fullStars = Math.floor(score);
        const hasHalfStar = score % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <span className="text-yellow-500">
                {"★".repeat(fullStars)}
                {hasHalfStar && "☆"}
                {"☆".repeat(emptyStars)}
            </span>
        );
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Reviews</h1>
                    {movieTitle && <p className="text-gray-500">for {movieTitle}</p>}
                </div>
                <button
                    onClick={() => router.push(`/movies/${movieId}/reviews/new`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Review
                </button>
            </div>
            
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleReviewClick(review)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{review.creator}</p>
                                    <p className="text-sm">{renderStars(review.score)} ({review.score}/5)</p>
                                </div>
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-2">{review.text}</p>
                        </div>
                    ))
                )}
            </div>

            <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Review Details"
            >
                {selectedReview && (
                    <div className="space-y-4">
                        <div>
                            <p className="font-semibold text-lg">{selectedReview.creator}</p>
                            <p className="text-lg">{renderStars(selectedReview.score)} ({selectedReview.score}/5)</p>
                        </div>
                        <p className="text-gray-700">{selectedReview.text}</p>
                        <p className="text-xs text-gray-400">ID: {selectedReview.id}</p>
                        
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                onClick={handleEdit}
                                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
