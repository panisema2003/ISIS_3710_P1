import { Movie } from "@/modules/movies/types/movie.type";

export interface Review {
  id: string;
  text: string;
  score: number;
  creator: string;
  movie: Movie;
}

