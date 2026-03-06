import { Movie } from "@/modules/movies/types/movie.type";

export interface Genre {
    id: string;
    type: string;
    movies?: Movie[];
}