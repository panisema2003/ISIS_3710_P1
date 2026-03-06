import { Actor } from "@/modules/actors/types/actor.type";
import { Director } from "@/modules/directors/types/director.type";
import { Genre } from "@/modules/genres/types/genre";
import { Platform } from "@/modules/platforms/types/platform.type";
import { Review } from "@/modules/reviews/types/revie.type";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTraile.type";
export interface Movie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  country: string;
  releaseDate: string;
  popularity: number;
  director?: Director;
  actors?: Actor[];
  genre?: Genre;
  platforms?: Platform[];
  reviews?: Review[];
  youtubeTrailer?: YoutubeTrailer;
  
}