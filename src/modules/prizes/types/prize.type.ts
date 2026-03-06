import { Actor } from "@/modules/actors/types/actor.type";
import { Director } from "@/modules/directors/types/director.type";
import { Movie } from "@/modules/movies/types/movie.type";

export interface Prize {
    id: string;
    name: string;
    category: string;
    year: number;
    status: string; // "won" or "nominated" (check with zod later)
    directors?: Director[]; //m2m
    movies? : Movie[]; //m2m
    actors?: Actor[]; //m2m
}