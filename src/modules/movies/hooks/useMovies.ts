"use client";

import { useState, useEffect } from "react";
import { Movie } from "@/modules/movies/types/movie.type";
import { fetchMovies } from "@/modules/movies/services/movie.service";

export function useMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                // reset status with each new load
                setIsLoading(true);
                setError(null);
                const data = await fetchMovies();
                setMovies(data);
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
        loadMovies();
    }, []); // empty dependency array means this runs only once (on load)

    // return state, and potentially, functions to reload
    return { movies, isLoading, error };
}