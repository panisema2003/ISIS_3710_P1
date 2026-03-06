import { apiFetcher } from "@/shared/services/http";
import { Review } from "@/modules/reviews/types/review.type";
import { ReviewFormData } from "../validation/review.schema";

// Reviews depend on movie (I think) one 2 many from backend (movie-review)

export const fetchMovieReviews = (movieId: string): Promise<Review[]> => {
    return apiFetcher<Review[]>(`/movies/${movieId}/reviews`);
}

export const fetchAllReviews = (): Promise<Review[]> => {
    return apiFetcher<Review[]>("/reviews");
}

export const createMovieReview = (movieId: string, data: ReviewFormData): Promise<Review> => {
    return apiFetcher<Review>(`/movies/${movieId}/reviews`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export const fetchReviewById = (movieId: string, reviewId: string): Promise<Review> => {
    return apiFetcher<Review>(`/movies/${movieId}/reviews/${reviewId}`);
}

export const updateReview = (movieId: string, reviewId: string, data: ReviewFormData): Promise<Review> => {
    return apiFetcher<Review>(`/movies/${movieId}/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export const deleteReview = (movieId: string, reviewId: string): Promise<void> => {
    return apiFetcher<void>(`/movies/${movieId}/reviews/${reviewId}`, {
        method: "DELETE",
    });
}
