import { apiFetcher } from "@/shared/services/http";
import { Movie } from "@/modules/movies/types/movie.type";
import { MovieFormData } from "../validation/movie.schema";

export const fetchMovies = (): Promise<Movie[]> => {
    return apiFetcher<Movie[]>("/movies");
}

export const createMovie = (data: Omit<MovieFormData, 'directorId' | 'genreId' | 'youtubeTrailerId' | 'actorIds' | 'platformIds'>): Promise<Movie> => {
    return apiFetcher<Movie>("/movies", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export const fetchMovieById = (id: string): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${id}`);
}

export const updateMovie = (id: string, data: Omit<MovieFormData, 'directorId' | 'genreId' | 'youtubeTrailerId' | 'actorIds' | 'platformIds'>): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export const deleteMovie = (id: string): Promise<void> => {
    return apiFetcher<void>(`/movies/${id}`, {
        method: "DELETE",
    });
}

// movie -actor m2m
export const addActorToMovie = (movieId: string, actorId: string): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${movieId}/actors/${actorId}`, {
        method: "POST",
    });
}

export const removeActorFromMovie = (movieId: string, actorId: string): Promise<void> => {
    return apiFetcher<void>(`/movies/${movieId}/actors/${actorId}`, {
        method: "DELETE",
    });
}

// movie -platform m2m
export const addPlatformToMovie = (movieId: string, platformId: string): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${movieId}/platforms/${platformId}`, {
        method: "POST",
    });
}

export const removePlatformFromMovie = (movieId: string, platformId: string): Promise<void> => {
    return apiFetcher<void>(`/movies/${movieId}/platforms/${platformId}`, {
        method: "DELETE",
    });
}

// movie director many to one
export const setMovieDirector = (movieId: string, directorId: string): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${movieId}/directors/${directorId}`, {
        method: "POST",
    });
}

// movie genre many to one 
export const setMovieGenre = (movieId: string, genreId: string): Promise<Movie> => {
    return apiFetcher<Movie>(`/movies/${movieId}/genres/${genreId}`, {
        method: "POST",
    });
}