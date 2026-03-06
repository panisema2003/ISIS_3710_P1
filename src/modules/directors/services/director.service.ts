import { apiFetcher } from "@/shared/services/http";
import { Director } from "@/modules/directors/types/director.type";
import { DirectorFormData } from "../validation/director.schema";

// Function to fetch directors from the API
export const fetchDirectors = (): Promise<Director[]> => {
    return apiFetcher<Director[]>("/directors");
}

// Function to create a new director
export const createDirector = (data: DirectorFormData): Promise<Director> => {
    return apiFetcher<Director>("/directors", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// Function to fetch a single director by ID
export const fetchDirectorById = (id: string): Promise<Director> => {
    return apiFetcher<Director>(`/directors/${id}`);
}

// Function to update an existing director
export const updateDirector = (id: string, data: DirectorFormData): Promise<Director> => {
    return apiFetcher<Director>(`/directors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Function to delete a director
export const deleteDirector = (id: string): Promise<void> => {
    return apiFetcher<void>(`/directors/${id}`, {
        method: "DELETE",
    });
}
