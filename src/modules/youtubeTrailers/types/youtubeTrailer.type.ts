import { Movie } from "@/modules/movies/types/movie.type";

export interface YoutubeTrailer {
  id: string;
  name: string;
  url: string;
  duration: number;
  channel: string;
  movie?: Movie;
}