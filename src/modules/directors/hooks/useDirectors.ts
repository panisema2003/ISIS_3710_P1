"use client";

import { useState, useEffect } from "react";
import { Director } from "@/modules/directors/types/director.type";
import { fetchDirectors } from "@/modules/directors/services/director.service";

export function useDirectors() {
    const [directors, setDirectors] = useState<Director[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDirectors = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchDirectors();
                setDirectors(data);
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
        loadDirectors();
    }, []);

    return { directors, isLoading, error };
}
