import ActorEditPage from "@/modules/actors/pages/ActorEditPage";

export default async function EditActorPageRoute({
  params,
}: {
  params: { actorId: string };
}) {
  const { actorId } = await params;

  return <ActorEditPage actorId={actorId} />;
}