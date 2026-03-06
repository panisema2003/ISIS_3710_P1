// asycn fetchActors() get to /api/v1/actors Ej workshop 2.3 Casos clave, array vacio
import { apiFetcher } from "@/shared/services/http";
import { Actor } from "@/modules/actors/types/actor.type"; // Shape of our data from the API
import { ActorFormData } from "../validation/actor.schema";

// Function to fetch actors from the API
export const fetchActors = (): Promise<Actor[]> => {
    // We call the GET /services endpoint.
    // The fetcher takes care of the base URL and error handling
    return apiFetcher<Actor[]>("/actors");
}

// Function to create a new actor
export const createActor = (data: ActorFormData) : Promise<Actor> => {
    // We call the POST /services endpoint with the actor data
    return apiFetcher<Actor>("/actors", {
        method: "POST",
        body: JSON.stringify(data), // json string
    });
}

// Function to fetch a single actor by Id
export const fetchActorById = (id: string): Promise<Actor> => {
    return apiFetcher<Actor>(`/actors/${id}`);
}

// Function to update an existing actor (by Id too)
export const updateActor = (id: string, data: ActorFormData): Promise<Actor> => {
    return apiFetcher<Actor>(`/actors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}

// Function to delete an actor (by Id)
export const deleteActor = (id: string): Promise<void> => {
    return apiFetcher<void>(`/actors/${id}`, {
        method: "DELETE",
    });
}

// Function to add a movie to an actor (many 2 many relationship)
export const addMovieToActor = (actorId: string, movieId: string): Promise<Actor> => {
    return apiFetcher<Actor>(`/actors/${actorId}/movies/${movieId}`, {
        method: "POST",
    });
}

// Function to remove a movie from an actor
export const removeMovieFromActor = (actorId: string, movieId: string): Promise<void> => {
    return apiFetcher<void>(`/actors/${actorId}/movies/${movieId}`, {
        method: "DELETE",
    });
}
