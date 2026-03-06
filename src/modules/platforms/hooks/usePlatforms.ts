"use client";

import { useState, useEffect } from "react";
import { Platform } from "@/modules/platforms/types/platform.type";
import { fetchPlatforms } from "@/modules/platforms/services/platform.service";

export function usePlatforms() {
    const [platforms, setPlatforms] = useState<Platform[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPlatforms = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchPlatforms();
                setPlatforms(data);
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
        loadPlatforms();
    }, []);

    return { platforms, isLoading, error };
}
