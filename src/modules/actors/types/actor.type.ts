import { Movie } from "@/modules/movies/types/movie.type";
export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string; // Even though on the backend its defined as Date, we use string, since the json doesn't parse Dates
  biography: string;
  movies?: Movie[] // Optional array of Movies
}