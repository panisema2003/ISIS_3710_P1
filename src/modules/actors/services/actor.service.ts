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
