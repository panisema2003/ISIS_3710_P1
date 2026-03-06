import { apiFetcher } from "@/shared/services/http";
import { Genre } from "@/modules/genres/types/genre.type";
import { GenreFormData } from "../validation/genre.schema";

export const fetchGenres = (): Promise<Genre[]> => {
    return apiFetcher<Genre[]>("/genres");
}

export const createGenre = (data: GenreFormData): Promise<Genre> => {
    return apiFetcher<Genre>("/genres", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export const fetchGenreById = (id: string): Promise<Genre> => {
    return apiFetcher<Genre>(`/genres/${id}`);
}

export const updateGenre = (id: string, data: GenreFormData): Promise<Genre> => {
    return apiFetcher<Genre>(`/genres/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

export const deleteGenre = (id: string): Promise<void> => {
    return apiFetcher<void>(`/genres/${id}`, {
        method: "DELETE",
    });
}
