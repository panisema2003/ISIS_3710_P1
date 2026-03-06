// Only Actor and movie have this 'Detailed' page, others, like director, have simply a modal that pops up when listed, like senetime services. 
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Actor } from "@/modules/actors/types/actor.type";
import { fetchActorById, deleteActor } from "@/modules/actors/services/actor.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

interface ActorDetailPageProps {
    actorId: string;
}

export default function ActorDetailPage({ actorId }: ActorDetailPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();

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
                setError(err instanceof Error ? err.message : "Failed to load actor");
            } finally {
                setIsLoading(false);
            }
        };
        loadActor();
    }, [actorId]);

    const handleDelete = async () => {
        if (!actor) return;

        if (!confirm(`Are you sure you want to delete "${actor.name}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteActor(actor.id);
            showNotification("Actor deleted successfully", "success");
            router.push("/actors");
        } catch (err) {
            showNotification(err instanceof Error ? err.message : "Failed to delete actor", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading actor details...</div>;
    }

    if (error || !actor) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500 mb-4">Error: {error || "Actor not found"}</p>
                {/* Back arrow icon from tailwind docs */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <Link href="/actors" className="text-blue-600 hover:underline">
                    Back to Actors
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
            {/* Back arrow icon from tailwind docs */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <Link href="/actors" className="text-blue-600 hover:underline mb-6 inline-block">
                Back to Actors
            </Link>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
                            <div className="w-full h-96 md:h-full bg-gray-200 flex items-center justify-center">
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
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="text-gray-600 text-sm font-medium">Nationality</span>
                                <p className="font-semibold text-gray-900">{actor.nationality}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">Birth Date</span>
                                <p className="font-semibold text-gray-900">
                                    {birthDate.toLocaleDateString()} ({age} years old)
                                </p>
                            </div>
                        </div>

                        {/* Biography */}
                        <div className="mb-6">
                            <span className="text-gray-600 text-sm font-medium block mb-2">Biography</span>
                            <p className="text-gray-800 leading-relaxed">{actor.biography}</p>
                        </div>

                        {/* Films */}
                        {actor.movies && actor.movies.length > 0 && (
                            <div>
                                <span className="text-gray-600 text-sm font-medium block mb-3">
                                    Filmography ({actor.movies.length} movies)
                                </span>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {actor.movies.map((movie) => (
                                        <Link
                                            key={movie.id}
                                            href={`/movies/${movie.id}`}
                                            className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border border-gray-200"
                                        >
                                            {movie.poster ? (
                                                <img
                                                    src={movie.poster}
                                                    alt={movie.title}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-16 bg-gray-300 rounded flex items-center justify-center">
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
                            </div>
                        )}
                        {/* If our actor doesn't have movies :( */}
                        {(!actor.movies || actor.movies.length === 0) && (
                            <div className="text-center py-8 bg-gray-100 rounded-lg border border-gray-200">
                                <p className="text-gray-600">No movies associated yet :v</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
