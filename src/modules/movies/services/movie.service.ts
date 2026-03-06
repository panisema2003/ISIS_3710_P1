import { apiFetcher } from "@/shared/services/http";
import { Movie } from "@/modules/movies/types/movie.type"; // Shape of our data from the API

export const fetchMovies = (): Promise<Movie[]> => {
    // We call the GET /services endpoint.
    // The fetcher takes care of the base URL and error handling
    return apiFetcher<Movie[]>("/movies");
}