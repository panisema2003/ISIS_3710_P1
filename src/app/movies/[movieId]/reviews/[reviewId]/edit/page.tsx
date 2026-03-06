import ReviewEditPage from "@/modules/reviews/pages/ReviewEditPage";

interface PageProps {
    params: Promise<{ movieId: string; reviewId: string }>;
}

export default async function EditReviewRoute({ params }: PageProps) {
    const { movieId, reviewId } = await params;
    return <ReviewEditPage movieId={movieId} reviewId={reviewId} />;
}
