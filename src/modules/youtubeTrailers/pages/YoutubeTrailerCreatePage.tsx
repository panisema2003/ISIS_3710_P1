"use client";

import { useRouter } from "next/navigation";
import { createYoutubeTrailer, setTrailerMovie } from "@/modules/youtubeTrailers/services/youtubeTrailer.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import YoutubeTrailerForm from "@/modules/youtubeTrailers/ui/YoutubeTrailerForm";
import { YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function YoutubeTrailerCreatePage() {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();
    
    const { movies, isLoading: loadingMovies } = useMovies();

    const handleSubmit = async (data: YoutubeTrailerFormData) => {
        const { movieId, ...trailerData } = data;
        
        try {
            // Create the trailer
            const createdTrailer = await createYoutubeTrailer(trailerData);
            
            // Associate with movie (not necessary tho)
            if (movieId) {
                await setTrailerMovie(createdTrailer.id, movieId);
            }
            
            showNotification(t.trailers.createdSuccess, "success");
            router.push("/youtube-trailers");
        } catch (error) {
            const message = error instanceof Error ? error.message : t.trailers.createError;
            if (message.includes("400")) {
                showNotification(t.trailers.invalidUrl, "error");
            } else {
                showNotification(message, "error");
            }
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-trailer-title">
            <h1 id="create-trailer-title" className="text-3xl font-bold mb-6">{t.trailers.createTitle}</h1>
            <YoutubeTrailerForm
                onSubmit={handleSubmit}
                submitLabel={t.trailers.createTrailer}
                movies={movies}
                isLoadingMovies={loadingMovies}
            />
        </section>
    );
}
