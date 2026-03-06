import { apiFetcher } from "@/shared/services/http"
import { Prize } from "../types/prize.type";
import { PrizeFormData } from "../validation/prize.schema";

export const fetchPrizes = async (): Promise<Prize[]> => {
    return apiFetcher<Prize[]>("/prizes");
}

// Function to create a new prize
export const createPrize = (data: PrizeFormData): Promise<Prize> => {
    // We call the POST /prizes endpoint with the prize data
    return apiFetcher<Prize>("/prizes", {
        method: "POST",
        body: JSON.stringify(data), // json string
    });
}

// prize - movie m2m (from prize side)
export const addMovieToPrize = (prizeId: string, movieId: string): Promise<Prize> => {
    return apiFetcher<Prize>(`/prizes/${prizeId}/movies/${movieId}`, {
        method: "POST",
    });
}

export const removeMovieFromPrize = (prizeId: string, movieId: string): Promise<void> => {
    return apiFetcher<void>(`/prizes/${prizeId}/movies/${movieId}`, {
        method: "DELETE",
    });
}

