"use client";

import { useState, useEffect } from "react";
import ActorForm from "../ui/ActorsForm";
import { ActorFormData } from "../validation/actor.schema";
import { useRouter } from "next/navigation";
import { fetchActorById, updateActor, addMovieToActor, removeMovieFromActor } from "../services/actor.service";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

interface ActorEditPageProps {
    actorId: string;
}

export default function ActorEditPage({ actorId }: ActorEditPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultValues, setDefaultValues] = useState<ActorFormData | undefined>(undefined);
    const router = useRouter();
    const { movies, isLoading: isLoadingMovies } = useMovies();
    const showNotification = useNotificationStore((state) => state.showNotification);

    // Load actor data on mount
    useEffect(() => {
        const loadActor = async () => {
            try {
                setIsLoading(true);
                const actor = await fetchActorById(actorId);
                // Map actor data to form data format
                setDefaultValues({
                    name: actor.name,
                    photo: actor.photo,
                    nationality: actor.nationality,
                    birthDate: actor.birthDate.split("T")[0], // Format date for input
                    biography: actor.biography,
                    movieIds: actor.movies?.map((m) => m.id) || [], // Associate movies by their IDs iif they exist
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load actor");
            } finally {
                setIsLoading(false);
            }
        };
        loadActor();
    }, [actorId]);

    const handleUpdateActor = async (data: ActorFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Update actor basic info (without movieIds, because it explodes elsewhere)
            const { movieIds, ...actorData } = data;
            await updateActor(actorId, actorData as ActorFormData);
            
            // Handle movie associations (hardest part by far bruh)
            const currentMovieIds = defaultValues?.movieIds || [];
            const newMovieIds = movieIds || [];
            
            // Find movies to remove (in current but not in new)
            const moviesToRemove = currentMovieIds.filter(id => !newMovieIds.includes(id));
            // Find movies to add (in new but not in current)
            const moviesToAdd = newMovieIds.filter(id => !currentMovieIds.includes(id));
            
            // Remove deselected movies
            for (const movieId of moviesToRemove) {
                await removeMovieFromActor(actorId, movieId);
            }
            
            // Add newly selected movies
            for (const movieId of moviesToAdd) {
                await addMovieToActor(actorId, movieId);
            }
            
            showNotification("Actor updated successfully!", "success");
            router.push("/actors");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while updating the actor.");
            showNotification("Failed to update actor.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container mx-auto p-8">
                <p>Loading actor...</p>
            </main>
        );
    }

    if (error && !defaultValues) { // If an error or no default values (we failed to load the actor)
        return (
            <main className="container mx-auto p-8">
                <p className="text-red-500">Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-red-600">Edit Actor</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <ActorForm
                onSubmit={handleUpdateActor}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
                movies={movies}
                isLoadingMovies={isLoadingMovies}
            />
        </main>
    );
}
