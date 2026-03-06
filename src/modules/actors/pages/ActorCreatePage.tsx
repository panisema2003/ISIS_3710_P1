"use client";

import { useState } from "react";
import ActorForm from "../ui/ActorsForm";
import { ActorFormData } from "../validation/actor.schema";
import { useRouter } from "next/navigation"; 
import { createActor, addMovieToActor } from "../services/actor.service";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function ActorCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); //redirect
    const { movies, isLoading: isLoadingMovies } = useMovies();

    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleCreateActor = async (data: ActorFormData) => {
        setIsSubmitting(true);
        try {
            // First create the actor without movies
            const { movieIds, ...actorData } = data;
            const createdActor = await createActor(actorData as ActorFormData);
            
            // Then associate each movie with the actor
            if (movieIds && movieIds.length > 0) {
                for (const movieId of movieIds) {
                    await addMovieToActor(createdActor.id, movieId);
                }
            }
            
            showNotification("Actor created successfully!", "success");
            router.push("/actors"); // Redirect to actors list after successful creation
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while creating the Actor, please try again later. ");
            showNotification("Failed to create actor.", "error");
        } finally {
            setIsSubmitting(false);
        }

    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Create New Actor</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ActorForm 
                onSubmit={handleCreateActor} 
                isSubmitting={isSubmitting} 
                movies={movies}
                isLoadingMovies={isLoadingMovies}
            />
        </main>
    );
}