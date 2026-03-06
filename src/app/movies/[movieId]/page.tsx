import MovieDetailPage from "@/modules/movies/pages/MovieDetailPage";

export default async function MovieDetailRoute({
    params,
}: {
    params: Promise<{ movieId: string }>;
}) {
    const { movieId } = await params;
    return <MovieDetailPage movieId={movieId} />;
}
