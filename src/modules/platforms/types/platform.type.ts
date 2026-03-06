import { Movie } from "@/modules/movies/types/movie.type";

export interface Platform {
    id: string;
    name: string;
    url: string;
    movies?: Movie[]; // Optional array of Movies available on this platform
}