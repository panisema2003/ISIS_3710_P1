import ReviewCreatePage from "@/modules/reviews/pages/ReviewCreatePage";

interface PageProps {
    params: Promise<{ movieId: string }>;
}

export default async function NewReviewRoute({ params }: PageProps) {
    const { movieId } = await params;
    return <ReviewCreatePage movieId={movieId} />;
}
