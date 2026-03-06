import GenreEditPage from "@/modules/genres/pages/GenreEditPage";

export default async function EditGenreRoute({
    params,
}: {
    params: { genreId: string };
}) {
    const { genreId } = await params;
    return <GenreEditPage genreId={genreId} />;
}
