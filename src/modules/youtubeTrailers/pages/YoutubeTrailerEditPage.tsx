"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    fetchYoutubeTrailerById, 
    updateYoutubeTrailer, 
    setTrailerMovie 
} from "@/modules/youtubeTrailers/services/youtubeTrailer.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import YoutubeTrailerForm from "@/modules/youtubeTrailers/ui/YoutubeTrailerForm";
import { YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useI18n } from "@/shared/i18n/I18nContext";

interface YoutubeTrailerEditPageProps {
    trailerId: string;
}

export default function YoutubeTrailerEditPage({ trailerId }: YoutubeTrailerEditPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();
    
    const [trailer, setTrailer] = useState<YoutubeTrailer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { movies, isLoading: loadingMovies } = useMovies();

    useEffect(() => {
        const loadTrailer = async () => {
            try {
                setIsLoading(true);
                const data = await fetchYoutubeTrailerById(trailerId);
                setTrailer(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : t.trailers.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrailer();
    }, [trailerId]);

    const handleSubmit = async (data: YoutubeTrailerFormData) => {
        const { movieId, ...trailerData } = data;

        // Update trailer
        await updateYoutubeTrailer(trailerId, trailerData);

        // Update movie association if changed
        if (movieId && movieId !== trailer?.movie?.id) {
            await setTrailerMovie(trailerId, movieId);
        }

        showNotification(t.trailers.updatedSuccess, "success");
        router.push("/youtube-trailers");
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error || !trailer) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error || t.trailers.trailerNotFound}</div>;
    }

    const defaultValues: Partial<YoutubeTrailerFormData> = {
        name: trailer.name,
        url: trailer.url,
        duration: trailer.duration,
        channel: trailer.channel,
        movieId: trailer.movie?.id,
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="edit-trailer-title">
            <h1 id="edit-trailer-title" className="text-3xl font-bold mb-6">{t.trailers.editTitle}</h1>
            <YoutubeTrailerForm
                onSubmit={handleSubmit}
                submitLabel={t.trailers.updateTrailer}
                defaultValues={defaultValues}
                movies={movies}
                isLoadingMovies={loadingMovies}
            />
        </section>
    );
}
