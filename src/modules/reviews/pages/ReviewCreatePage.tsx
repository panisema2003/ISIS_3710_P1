"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createMovieReview } from "@/modules/reviews/services/review.service";
import { fetchMovieById } from "@/modules/movies/services/movie.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import ReviewForm from "@/modules/reviews/ui/ReviewForm";
import { ReviewFormData } from "@/modules/reviews/validation/review.schema";
import { Movie } from "@/modules/movies/types/movie.type";

interface ReviewCreatePageProps {
    movieId: string;
}

export default function ReviewCreatePage({ movieId }: ReviewCreatePageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoadingMovie, setIsLoadingMovie] = useState(true);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await fetchMovieById(movieId);
                setMovie(data);
            } catch {
                showNotification("Movie not found", "error");
            } finally {
                setIsLoadingMovie(false);
            }
        };
        loadMovie();
    }, [movieId, showNotification]);

    const handleSubmit = async (data: ReviewFormData) => {
        try {
            await createMovieReview(movieId, data);
            showNotification("Review created successfully!", "success");
            router.push(`/movies/${movieId}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create review";
            showNotification(message, "error");
        }
    };

    if (isLoadingMovie) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <Link href={`/movies/${movieId}`} className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to {movie?.title || "Movie"}
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">Write a Review</h1>
            {movie && (
                <p className="text-gray-600 mb-6">for <span className="font-medium">{movie.title}</span></p>
            )}
            
            <ReviewForm
                onSubmit={handleSubmit}
                submitLabel="Submit Review"
            />
        </div>
    );
}
