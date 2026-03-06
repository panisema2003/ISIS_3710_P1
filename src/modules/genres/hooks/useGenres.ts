"use client";

import { useState, useEffect } from "react";
import { Genre } from "@/modules/genres/types/genre.type";
import { fetchGenres } from "@/modules/genres/services/genre.service";

export function useGenres() {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchGenres();
                setGenres(data);
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
        loadGenres();
    }, []);

    return { genres, isLoading, error };
}
