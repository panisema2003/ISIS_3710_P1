import ActorDetailPage from "@/modules/actors/pages/ActorDetailPage";

export default async function ActorDetailRoute({
    params,
}: {
    params: Promise<{ actorId: string }>;
}) {
    const { actorId } = await params;
    return <ActorDetailPage actorId={actorId} />;
}
