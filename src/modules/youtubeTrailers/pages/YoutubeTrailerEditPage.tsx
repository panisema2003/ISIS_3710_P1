"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
    fetchYoutubeTrailerById, 
    updateYoutubeTrailer, 
    setTrailerMovie 
} from "@/modules/youtubeTrailers/services/youtubeTrailer.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import YoutubeTrailerForm from "@/modules/youtubeTrailers/ui/YoutubeTrailerForm";
import { YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { useMovies } from "@/modules/movies/hooks/useMovies";

interface YoutubeTrailerEditPageProps {
    trailerId: string;
}

export default function YoutubeTrailerEditPage({ trailerId }: YoutubeTrailerEditPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    
    const [trailer, setTrailer] = useState<YoutubeTrailer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { movies, isLoading: loadingMovies } = useMovies();

    useEffect(() => {
        const loadTrailer = async () => {
            try {
                setIsLoading(true);
                const data = await fetchYoutubeTrailerById(trailerId);
                setTrailer(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load trailer");
            } finally {
                setIsLoading(false);
            }
        };
        loadTrailer();
    }, [trailerId]);

    const handleSubmit = async (data: YoutubeTrailerFormData) => {
        const { movieId, ...trailerData } = data;

        // Update trailer
        await updateYoutubeTrailer(trailerId, trailerData);

        // Update movie association if changed
        if (movieId && movieId !== trailer?.movie?.id) {
            await setTrailerMovie(trailerId, movieId);
        }

        showNotification("Trailer updated successfully!", "success");
        router.push("/youtube-trailers");
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error || !trailer) {
        return <div className="text-center p-8 text-red-500">Error: {error || "Trailer not found"}</div>;
    }

    const defaultValues: Partial<YoutubeTrailerFormData> = {
        name: trailer.name,
        url: trailer.url,
        duration: trailer.duration,
        channel: trailer.channel,
        movieId: trailer.movie?.id,
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Trailer</h1>
            <YoutubeTrailerForm
                onSubmit={handleSubmit}
                submitLabel="Update Trailer"
                defaultValues={defaultValues}
                movies={movies}
                isLoadingMovies={loadingMovies}
            />
        </div>
    );
}
