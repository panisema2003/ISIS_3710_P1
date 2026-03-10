"use client";

import { useActors } from "@/modules/actors/hooks/useActors";
import { useI18n } from "@/shared/i18n/I18nContext";
import Link from "next/link";

export default function ActorsPage() {
    const { actors, isLoading, error } = useActors();
    const { t } = useI18n();

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-red-600">{t.actors.title}</h1>
                <Link
                    href="/actors/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                    aria-label={t.actors.newActor}
                >
                    {t.actors.newActor}
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label={t.actors.title}>
                {actors.map((actor) => (
                    <Link
                        key={actor.id}
                        href={`/actors/${actor.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        role="listitem"
                        aria-label={actor.name}
                    >
                        <div className="h-56 overflow-hidden bg-gray-100">
                            <img
                                src={actor.photo}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-900 truncate">{actor.name}</h2>
                            <p className="text-sm text-gray-600">{actor.nationality}</p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{actor.biography}</p>
                            {actor.movies && actor.movies.length > 0 && (
                                <p className="text-xs text-blue-600 mt-2">
                                    {actor.movies.length} {actor.movies.length === 1 ? t.actors.movie : t.actors.movies}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}