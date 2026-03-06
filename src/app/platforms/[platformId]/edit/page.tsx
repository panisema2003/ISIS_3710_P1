import PlatformEditPage from "@/modules/platforms/pages/PlatformEditPage";

export default async function EditPlatformRoute({
    params,
}: {
    params: { platformId: string };
}) {
    const { platformId } = await params;
    return <PlatformEditPage platformId={platformId} />;
}
