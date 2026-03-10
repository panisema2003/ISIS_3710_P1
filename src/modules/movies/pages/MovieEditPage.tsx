"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
    fetchMovieById, 
    updateMovie, 
    addActorToMovie, 
    removeActorFromMovie,
    addPlatformToMovie,
    removePlatformFromMovie,
    addPrizeToMovie,
    removePrizeFromMovie
} from "@/modules/movies/services/movie.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import MovieForm from "@/modules/movies/ui/MovieForm";
import { MovieFormData } from "@/modules/movies/validation/movie.schema";
import { Movie } from "@/modules/movies/types/movie.type";
import { useI18n } from "@/shared/i18n/I18nContext";
import { useActors } from "@/modules/actors/hooks/useActors";
import { useDirectors } from "@/modules/directors/hooks/useDirectors";
import { useGenres } from "@/modules/genres/hooks/useGenres";
import { usePlatforms } from "@/modules/platforms/hooks/usePlatforms";
import { useYoutubeTrailers } from "@/modules/youtubeTrailers/hooks/useYoutubeTrailers";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { usePrizes } from "@/modules/prizes/hooks/usePrizes";

interface MovieEditPageProps {
    movieId: string;
}

export default function MovieEditPage({ movieId }: MovieEditPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();
    
    const [movie, setMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { actors, isLoading: loadingActors } = useActors();
    const { directors, isLoading: loadingDirectors } = useDirectors();
    const { genres, isLoading: loadingGenres } = useGenres();
    const { platforms, isLoading: loadingPlatforms } = usePlatforms();
    const { youtubeTrailers, isLoading: loadingTrailers } = useYoutubeTrailers();
    const { movies, isLoading: loadingMovies } = useMovies();
    const { prizes, isLoading: loadingPrizes } = usePrizes();

    // Get Ids of trailers already assigned to pthre movies, so they dont show 
    const usedTrailerIds = useMemo(() => {
        return movies
            .filter((m) => m.id !== movieId && m.youtubeTrailer?.id)
            .map((m) => m.youtubeTrailer!.id);
    }, [movies, movieId]);

    const isLoadingRelations = loadingActors || loadingDirectors || loadingGenres || loadingPlatforms || loadingTrailers || loadingMovies || loadingPrizes;

    useEffect(() => {
        const loadMovie = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMovieById(movieId);
                setMovie(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : t.movies.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadMovie();
    }, [movieId]);

    const handleSubmit = async (data: MovieFormData) => {
        if (!movie) return;

        const { directorId, genreId, youtubeTrailerId, actorIds, platformIds, prizeIds, ...movieData } = data;
        
        const updatePayload = {
            ...movieData,
            genre: { id: genreId },
            director: { id: directorId },
            youtubeTrailer: { id: youtubeTrailerId },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await updateMovie(movieId, updatePayload as any);

        // Handle actors (m2m)
        const currentActorIds = movie.actors?.map(a => a.id) || [];
        const newActorIds = actorIds || [];

        // Remove actors that were deselected
        for (const actorId of currentActorIds) {
            if (!newActorIds.includes(actorId)) {
                await removeActorFromMovie(movieId, actorId);
            }
        }

        // Add new actors
        for (const actorId of newActorIds) {
            if (!currentActorIds.includes(actorId)) {
                await addActorToMovie(movieId, actorId);
            }
        }

        // Handle platforms (m2m)
        const currentPlatformIds = movie.platforms?.map(p => p.id) || [];
        const newPlatformIds = platformIds || [];

        // Remove platforms that were deselected
        for (const platformId of currentPlatformIds) {
            if (!newPlatformIds.includes(platformId)) {
                await removePlatformFromMovie(movieId, platformId);
            }
        }

        // Add new platforms
        for (const platformId of newPlatformIds) {
            if (!currentPlatformIds.includes(platformId)) {
                await addPlatformToMovie(movieId, platformId);
            }
        }

        // Handle prizes (m2m)
        const currentPrizeIds = movie.prizes?.map(p => p.id) || [];
        const newPrizeIds = prizeIds || [];

        for (const prizeId of currentPrizeIds) {
            if (!newPrizeIds.includes(prizeId)) {
                await removePrizeFromMovie(movieId, prizeId);
            }
        }

        for (const prizeId of newPrizeIds) {
            if (!currentPrizeIds.includes(prizeId)) {
                await addPrizeToMovie(movieId, prizeId);
            }
        }

        showNotification(t.movies.updatedSuccess, "success");
        router.push("/movies");
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error || !movie) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error || t.movies.movieNotFound}</div>;
    }

    const defaultValues: Partial<MovieFormData> = {
        title: movie.title,
        poster: movie.poster,
        duration: movie.duration,
        country: movie.country,
        releaseDate: movie.releaseDate,
        popularity: movie.popularity,
        directorId: movie.director?.id,
        genreId: movie.genre?.id,
        youtubeTrailerId: movie.youtubeTrailer?.id,
        actorIds: movie.actors?.map(a => a.id) || [],
        platformIds: movie.platforms?.map(p => p.id) || [],
        prizeIds: movie.prizes?.map(p => p.id) || [],
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="edit-movie-title">
            <h1 id="edit-movie-title" className="text-3xl font-bold mb-6 text-blue-600">{t.movies.editTitle}</h1>
            <MovieForm
                onSubmit={handleSubmit}
                submitLabel={t.movies.updateMovie}
                defaultValues={defaultValues}
                actors={actors}
                directors={directors}
                genres={genres}
                platforms={platforms}
                youtubeTrailers={youtubeTrailers}
                usedTrailerIds={usedTrailerIds}
                currentTrailerId={movie.youtubeTrailer?.id}
                prizes={prizes}
                isLoadingRelations={isLoadingRelations}
            />
        </section>
    );
}
