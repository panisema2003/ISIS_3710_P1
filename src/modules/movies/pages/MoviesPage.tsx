"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMovies } from "@/modules/movies/hooks/useMovies";

export default function MoviesPage() {
    const { movies, isLoading, error } = useMovies();
    const router = useRouter();

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-600">Movies</h1>
                <button
                    onClick={() => router.push("/movies/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    + Add Movie
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                        {movie.poster ? (
                            <img 
                                src={movie.poster} 
                                alt={movie.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-4xl">🎬</span>
                            </div>
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-900 truncate">{movie.title}</h2>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-600">{movie.country}</p>
                                <p className="text-sm text-yellow-600 font-medium">⭐ {movie.popularity}</p>
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