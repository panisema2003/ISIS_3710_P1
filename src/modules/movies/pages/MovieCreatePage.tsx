"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { createMovie, addActorToMovie, addPlatformToMovie } from "@/modules/movies/services/movie.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import MovieForm from "@/modules/movies/ui/MovieForm";
import { MovieFormData } from "@/modules/movies/validation/movie.schema";
import { useActors } from "@/modules/actors/hooks/useActors";
import { useDirectors } from "@/modules/directors/hooks/useDirectors";
import { useGenres } from "@/modules/genres/hooks/useGenres";
import { usePlatforms } from "@/modules/platforms/hooks/usePlatforms";
import { useYoutubeTrailers } from "@/modules/youtubeTrailers/hooks/useYoutubeTrailers";
import { useMovies } from "@/modules/movies/hooks/useMovies";

export default function MovieCreatePage() {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    
    const { actors, isLoading: loadingActors } = useActors();
    const { directors, isLoading: loadingDirectors } = useDirectors();
    const { genres, isLoading: loadingGenres } = useGenres();
    const { platforms, isLoading: loadingPlatforms } = usePlatforms();
    const { youtubeTrailers, isLoading: loadingTrailers } = useYoutubeTrailers();
    const { movies, isLoading: loadingMovies } = useMovies();

    // Get Ids of trailers already assigned to movies
    const usedTrailerIds = useMemo(() => {
        return movies
            .filter((movie) => movie.youtubeTrailer?.id)
            .map((movie) => movie.youtubeTrailer!.id);
    }, [movies]);

    const isLoadingRelations = loadingActors || loadingDirectors || loadingGenres || loadingPlatforms || loadingTrailers || loadingMovies;

    const handleSubmit = async (data: MovieFormData) => {
        const { directorId, genreId, youtubeTrailerId, actorIds, platformIds, ...movieData } = data;
        
        // Create the movie with genre, director, and youtubeTrailer (else it explodes when posting)
        const moviePayload = {
            ...movieData,
            genre: { id: genreId },
            director: { id: directorId },
            youtubeTrailer: { id: youtubeTrailerId },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any (so it doesnt complain)
        const createdMovie = await createMovie(moviePayload as any);
        
        // Add actors (m2m)
        if (actorIds && actorIds.length > 0) {
            for (const actorId of actorIds) {
                await addActorToMovie(createdMovie.id, actorId);
            }
        }
        
        // Add platforms (m2m)
        if (platformIds && platformIds.length > 0) {
            for (const platformId of platformIds) {
                await addPlatformToMovie(createdMovie.id, platformId);
            }
        }
        
        showNotification("Movie created successfully!", "success");
        router.push("/movies");
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Create New Movie</h1>
            <MovieForm
                onSubmit={handleSubmit}
                submitLabel="Create Movie"
                actors={actors}
                directors={directors}
                genres={genres}
                platforms={platforms}
                youtubeTrailers={youtubeTrailers}
                usedTrailerIds={usedTrailerIds}
                isLoadingRelations={isLoadingRelations}
            />
        </div>
    );
}
