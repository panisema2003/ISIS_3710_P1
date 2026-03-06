import YoutubeTrailerEditPage from "@/modules/youtubeTrailers/pages/YoutubeTrailerEditPage";

interface PageProps {
    params: Promise<{ trailerId: string }>;
}

export default async function EditYoutubeTrailerRoute({ params }: PageProps) {
    const { trailerId } = await params;
    return <YoutubeTrailerEditPage trailerId={trailerId} />;
}
