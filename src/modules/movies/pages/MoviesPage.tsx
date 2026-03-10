"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function MoviesPage() {
    const { movies, isLoading, error } = useMovies();
    const router = useRouter();
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
                <h1 className="text-3xl font-bold text-blue-600">{t.movies.title}</h1>
                <button
                    onClick={() => router.push("/movies/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label={t.movies.addMovie}
                >
                    {t.movies.addMovie}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label={t.movies.title}>
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        role="listitem"
                        aria-label={movie.title}
                    >
                        {movie.poster ? (
                            <img 
                                src={movie.poster} 
                                alt={movie.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-4xl" aria-hidden="true">🎬</span>
                            </div>
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-900 truncate">{movie.title}</h2>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">{movie.country}</p>
                                <p className="text-sm text-yellow-600 font-medium"><span aria-hidden="true">⭐</span> {movie.popularity}</p>
                            </div>
                            <p className="text-sm text-gray-600">{movie.duration} min</p>
                            {movie.genre && (
                                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                    {movie.genre.type}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}