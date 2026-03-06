import { apiFetcher } from "@/shared/services/http";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { YoutubeTrailerFormData } from "../validation/youtubeTrailer.schema";

export const fetchYoutubeTrailers = (): Promise<YoutubeTrailer[]> => {
    return apiFetcher<YoutubeTrailer[]>("/youtube-trailers");
}

export const createYoutubeTrailer = (data: Omit<YoutubeTrailerFormData, 'movieId'>): Promise<YoutubeTrailer> => {
    return apiFetcher<YoutubeTrailer>("/youtube-trailers", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export const fetchYoutubeTrailerById = (id: string): Promise<YoutubeTrailer> => {
    return apiFetcher<YoutubeTrailer>(`/youtube-trailers/${id}`);
}

export const updateYoutubeTrailer = (id: string, data: Omit<YoutubeTrailerFormData, 'movieId'>): Promise<YoutubeTrailer> => {
    return apiFetcher<YoutubeTrailer>(`/youtube-trailers/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export const deleteYoutubeTrailer = (id: string): Promise<void> => {
    return apiFetcher<void>(`/youtube-trailers/${id}`, {
        method: "DELETE",
    });
}

// Associate to only a movie
export const setTrailerMovie = (trailerId: string, movieId: string): Promise<YoutubeTrailer> => {
    return apiFetcher<YoutubeTrailer>(`/youtube-trailers/${trailerId}/movies/${movieId}`, {
        method: "POST",
    });
}
