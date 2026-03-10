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
import { useI18n } from "@/shared/i18n/I18nContext";

interface ReviewCreatePageProps {
    movieId: string;
}

export default function ReviewCreatePage({ movieId }: ReviewCreatePageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoadingMovie, setIsLoadingMovie] = useState(true);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const data = await fetchMovieById(movieId);
                setMovie(data);
            } catch {
                showNotification(t.reviews.movieNotFound, "error");
            } finally {
                setIsLoadingMovie(false);
            }
        };
        loadMovie();
    }, [movieId, showNotification]);

    const handleSubmit = async (data: ReviewFormData) => {
        try {
            await createMovieReview(movieId, data);
            showNotification(t.reviews.createdSuccess, "success");
            router.push(`/movies/${movieId}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : t.reviews.createError;
            showNotification(message, "error");
        }
    };

    if (isLoadingMovie) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-review-title">
            <Link href={`/movies/${movieId}`} className="text-blue-600 hover:underline mb-4 inline-block">
                ← {t.reviews.backToMovie} {movie?.title || "Movie"}
            </Link>
            
            <h1 id="create-review-title" className="text-3xl font-bold mb-2">{t.reviews.writeReview}</h1>
            {movie && (
                <p className="text-gray-600 mb-6">{t.reviews.forMovie} <span className="font-medium">{movie.title}</span></p>
            )}
            
            <ReviewForm
                onSubmit={handleSubmit}
                submitLabel={t.reviews.submitReview}
            />
        </section>
    );
}
