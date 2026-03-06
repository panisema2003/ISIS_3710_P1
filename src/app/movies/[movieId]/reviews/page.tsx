import MovieReviewsPage from "@/modules/reviews/pages/MovieReviewsPage";
import { fetchMovieById } from "@/modules/movies/services/movie.service";

interface PageProps {
    params: Promise<{ movieId: string }>;
}

export default async function MovieReviewsRoute({ params }: PageProps) {
    const { movieId } = await params;
    

    const movie = await fetchMovieById(movieId);
    const movieTitle = movie.title;

    
    return <MovieReviewsPage movieId={movieId} movieTitle={movieTitle} />;
}
