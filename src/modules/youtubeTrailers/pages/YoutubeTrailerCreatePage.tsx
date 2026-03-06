"use client";

import { useRouter } from "next/navigation";
import { createYoutubeTrailer, setTrailerMovie } from "@/modules/youtubeTrailers/services/youtubeTrailer.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import YoutubeTrailerForm from "@/modules/youtubeTrailers/ui/YoutubeTrailerForm";
import { YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { useMovies } from "@/modules/movies/hooks/useMovies";

export default function YoutubeTrailerCreatePage() {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    
    const { movies, isLoading: loadingMovies } = useMovies();

    const handleSubmit = async (data: YoutubeTrailerFormData) => {
        const { movieId, ...trailerData } = data;
        
        try {
            // Create the trailer
            const createdTrailer = await createYoutubeTrailer(trailerData);
            
            // Associate with movie (not necessary tho)
            if (movieId) {
                await setTrailerMovie(createdTrailer.id, movieId);
            }
            
            showNotification("Trailer created successfully!", "success");
            router.push("/youtube-trailers");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create trailer";
            if (message.includes("400")) {
                showNotification("Invalid YouTube URL format. Please provide a valid YouTube video URL.", "error");
            } else {
                showNotification(message, "error");
            }
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Trailer</h1>
            <YoutubeTrailerForm
                onSubmit={handleSubmit}
                submitLabel="Create Trailer"
                movies={movies}
                isLoadingMovies={loadingMovies}
            />
        </div>
    );
}
