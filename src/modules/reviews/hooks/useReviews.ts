"use client";

import { useState, useEffect } from "react";
import { Review } from "@/modules/reviews/types/review.type";
import { fetchMovieReviews, fetchAllReviews } from "@/modules/reviews/services/review.service";

export function useReviews(movieId?: string) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = movieId 
                    ? await fetchMovieReviews(movieId)
                    : await fetchAllReviews();
                setReviews(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadReviews();
    }, [movieId]);

    return { reviews, isLoading, error };
}
