"use client";

import { useState, useEffect } from "react";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { fetchYoutubeTrailers } from "@/modules/youtubeTrailers/services/youtubeTrailer.service";

export function useYoutubeTrailers() {
    const [youtubeTrailers, setYoutubeTrailers] = useState<YoutubeTrailer[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadYoutubeTrailers = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const data = await fetchYoutubeTrailers();
                setYoutubeTrailers(data);
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
        loadYoutubeTrailers();
    }, []);

    return { youtubeTrailers, isLoading, error };
}
