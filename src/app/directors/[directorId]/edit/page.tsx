import DirectorEditPage from "@/modules/directors/pages/DirectorEditPage";

export default async function EditDirectorRoute({
    params,
}: {
    params: { directorId: string };
}) {
    const { directorId } = await params;
    return <DirectorEditPage directorId={directorId} />;
}
