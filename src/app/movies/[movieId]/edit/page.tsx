import MovieEditPage from "@/modules/movies/pages/MovieEditPage";

interface PageProps {
    params: Promise<{ movieId: string }>;
}

export default async function EditMoviePage({ params }: PageProps) {
    const { movieId } = await params;
    return <MovieEditPage movieId={movieId} />;
}
