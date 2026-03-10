"use client";

import { useState } from "react";
import ActorForm from "../ui/ActorsForm";
import { ActorFormData } from "../validation/actor.schema";
import { useRouter } from "next/navigation"; 
import { createActor, addMovieToActor } from "../services/actor.service";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function ActorCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { movies, isLoading: isLoadingMovies } = useMovies();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    const handleCreateActor = async (data: ActorFormData) => {
        setIsSubmitting(true);
        try {
            const { movieIds, ...actorData } = data;
            const createdActor = await createActor(actorData as ActorFormData);
            
            if (movieIds && movieIds.length > 0) {
                for (const movieId of movieIds) {
                    await addMovieToActor(createdActor.id, movieId);
                }
            }
            
            showNotification(t.actors.createdSuccess, "success");
            router.push("/actors");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.actors.createError);
            showNotification(t.actors.createError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-actor-heading">
            <h1 id="create-actor-heading" className="text-3xl font-bold mb-6 text-red-600">{t.actors.createTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <ActorForm 
                onSubmit={handleCreateActor} 
                isSubmitting={isSubmitting} 
                movies={movies}
                isLoadingMovies={isLoadingMovies}
            />
        </section>
    );
}