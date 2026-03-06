"use client";

import { useState, useEffect } from "react";
import { Prize } from "@/modules/prizes/types/prize.type";
import { fetchPrizes } from "@/modules/prizes/services/prize.service";

export function usePrizes() {
    const [prizes, setPrizes] = useState<Prize[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPrizes = async () => {
            try {
                const data = await fetchPrizes();
                setPrizes(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch prizes");
            } finally {
                setIsLoading(false);
            }
        };

        loadPrizes();
    }, []);

    return { prizes, isLoading, error };
}
