import { apiFetcher } from "@/shared/services/http";
import { Platform } from "@/modules/platforms/types/platform.type";
import { PlatformFormData } from "../validation/platform.schema";

export const fetchPlatforms = (): Promise<Platform[]> => {
    return apiFetcher<Platform[]>("/platforms");
}

export const createPlatform = (data: PlatformFormData): Promise<Platform> => {
    return apiFetcher<Platform>("/platforms", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export const fetchPlatformById = (id: string): Promise<Platform> => {
    return apiFetcher<Platform>(`/platforms/${id}`);
}

export const updatePlatform = (id: string, data: PlatformFormData): Promise<Platform> => {
    return apiFetcher<Platform>(`/platforms/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export const deletePlatform = (id: string): Promise<void> => {
    return apiFetcher<void>(`/platforms/${id}`, {
        method: "DELETE",
    });
}

//  m2m association with movies
export const addMovieToPlatform = (platformId: string, movieId: string): Promise<Platform> => {
    return apiFetcher<Platform>(`/platforms/${platformId}/movies/${movieId}`, {
        method: "POST",
    });
}

export const removeMovieFromPlatform = (platformId: string, movieId: string): Promise<void> => {
    return apiFetcher<void>(`/platforms/${platformId}/movies/${movieId}`, {
        method: "DELETE",
    });
}
