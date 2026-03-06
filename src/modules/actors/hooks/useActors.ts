"use client";

import { useState, useEffect } from "react";
import { Actor } from "@/modules/actors/types/actor.type";
import { fetchActors } from "@/modules/actors/services/actor.service";

export function useActors() {
    const [actors, setActors] = useState<Actor[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadActors = async () => {
            try {
                // reset status with each new load
                setIsLoading(true);
                setError(null);
                const data = await fetchActors();
                setActors(data);
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
        loadActors();
    }, []); // empty dependency array means this runs only once (on load)

    // return state, and potentially, functions to reload
    return { actors, isLoading, error };
}
