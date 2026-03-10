// Only Actor and movie have this 'Detailed' page, others, like director, have simply a modal that pops up when listed, like senetime services. 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Actor } from "@/modules/actors/types/actor.type";
import { fetchActorById, deleteActor } from "@/modules/actors/services/actor.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

interface ActorDetailPageProps {
    actorId: string;
}

export default function ActorDetailPage({ actorId }: ActorDetailPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();

    const [actor, setActor] = useState<Actor | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadActor = async () => {
            try {
                setIsLoading(true);
                const data = await fetchActorById(actorId);
                setActor(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : t.actors.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadActor();
    }, [actorId, t.actors.loadError]);

    const handleDelete = async () => {
        if (!actor) return;

        if (!confirm(t.confirmDelete.replace("{name}", actor.name))) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteActor(actor.id);
            showNotification(t.actors.deletedSuccess, "success");
            router.push("/actors");
        } catch (err) {
            showNotification(err instanceof Error ? err.message : t.actors.deleteError, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error || !actor) {
        return (
            <div className="text-center p-8" role="alert">
                <p className="text-red-500 mb-4">{t.error}: {error || t.actors.actorNotFound}</p>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <Link href="/actors" className="text-blue-600 hover:underline">
                    {t.actors.backToActors}
                </Link>
            </div>
        );
    }

    const birthDate = new Date(actor.birthDate);
    const age = Math.floor(
        (new Date().getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return (
        <div className="container mx-auto p-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <Link href="/actors" className="text-blue-600 hover:underline mb-6 inline-block">
                {t.actors.backToActors}
            </Link>

            <article className="bg-white rounded-lg shadow-lg overflow-hidden" aria-label={actor.name}>
                <div className="md:flex">
                    {/* Photo */}
                    <div className="md:w-1/3">
                        {actor.photo ? (
                            <img
                                src={actor.photo}
                                alt={actor.name}
                                className="w-full h-96 md:h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-96 md:h-full bg-gray-200 flex items-center justify-center" aria-hidden="true">
                                <span className="text-gray-400 text-6xl">👤</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold">{actor.name}</h1>
                            <div className="flex gap-2">
                                <Link
                                    href={`/actors/${actor.id}/edit`}
                                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                                    aria-label={`${t.edit} ${actor.name}`}
                                >
                                    {t.edit}
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300"
                                    aria-label={`${t.delete} ${actor.name}`}
                                >
                                    {isDeleting ? t.deleting : t.delete}
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.actors.nationality}</span>
                                <p className="font-semibold text-gray-900">{actor.nationality}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.actors.birthDate}</span>
                                <p className="font-semibold text-gray-900">
                                    {birthDate.toLocaleDateString()} ({age} {t.actors.yearsOld})
                                </p>
                            </div>
                        </div>

                        {/* Biography */}
                        <div className="mb-6">
                            <span className="text-gray-600 text-sm font-medium block mb-2">{t.actors.biography}</span>
                            <p className="text-gray-800 leading-relaxed">{actor.biography}</p>
                        </div>

                        {/* Films */}
                        {actor.movies && actor.movies.length > 0 && (
                            <section aria-label={t.actors.filmography}>
                                <span className="text-gray-600 text-sm font-medium block mb-3">
                                    {t.actors.filmography} ({actor.movies.length} {t.actors.movies})
                                </span>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3" role="list">
                                    {actor.movies.map((movie) => (
                                        <Link
                                            key={movie.id}
                                            href={`/movies/${movie.id}`}
                                            className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                                            role="listitem"
                                            aria-label={movie.title}
                                        >
                                            {movie.poster ? (
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center" aria-hidden="true">
                                                    <span className="text-gray-500">🎬</span>
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="font-semibold text-sm truncate text-gray-900">
                                                    {movie.title}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {movie.country}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                        {(!actor.movies || actor.movies.length === 0) && (
                            <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="text-gray-600">{t.actors.noMoviesAssociated}</p>
                            </div>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
