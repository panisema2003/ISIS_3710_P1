import { Actor } from "@/modules/actors/types/actor.type";
import { Director } from "@/modules/directors/types/director.type";
import { Genre } from "@/modules/genres/types/genre.type";
import { Platform } from "@/modules/platforms/types/platform.type";
import { Prize } from "@/modules/prizes/types/prize.type";
import { Review } from "@/modules/reviews/types/review.type";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
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
  prizes?: Prize[]; //m2m
  
}