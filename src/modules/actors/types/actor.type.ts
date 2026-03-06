import { Movie } from "@/modules/movies/types/movie.type";
export interface Actor {
  id: string;
  name: string;
  photo: string;
  nationality: string;
  birthDate: string; // Even though on the backend its defined as Date, we use string, since the json doesn't parse Dates
  biography: string;
  movies?: Movie[] // Optional array of Movies, since the data from the api comes as: {"id":"fa540a31-2c26-42dc-afb5-2cd30af6a88e","name":"Barnett Campagne","photo":"http://dummyimage.com/237x100.png/cc0000/ffffff","nationality":"Ireland","birthDate":"1995-12-20T00:00:00.000Z","biography":"Reactive dynamic hardware","movies":[{"id":"74d10db7-03b8-4050-a663-11814f611e52","title":"Item, The","poster":"http://dummyimage.com/107x100.png/ff4444/ffffff","duration":4,"country":"Indonesia","releaseDate":"1925-06-03T00:00:00.000Z","popularity":3}]

}