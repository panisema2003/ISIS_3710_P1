"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { youtubeTrailerSchema, YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { Movie } from "@/modules/movies/types/movie.type";

interface YoutubeTrailerFormProps {
    onSubmit: (data: YoutubeTrailerFormData) => Promise<void>;
    submitLabel: string;
    defaultValues?: Partial<YoutubeTrailerFormData>;
    movies?: Movie[];
    isLoadingMovies?: boolean;
}

export default function YoutubeTrailerForm({
    onSubmit,
    submitLabel,
    defaultValues,
    movies = [],
    isLoadingMovies = false,
}: YoutubeTrailerFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<YoutubeTrailerFormData>({
        resolver: zodResolver(youtubeTrailerSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Trailer name"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-800 mb-1">
                    URL *
                </label>
                <input
                    type="url"
                    id="url"
                    {...register("url")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                />
                {errors.url && (
                    <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-800 mb-1">
                    Duration (seconds) *
                </label>
                <input
                    type="number"
                    id="duration"
                    {...register("duration", { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="120"
                />
                {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="channel" className="block text-sm font-medium text-gray-800 mb-1">
                    Channel *
                </label>
                <input
                    type="text"
                    id="channel"
                    {...register("channel")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Channel name"
                />
                {errors.channel && (
                    <p className="mt-1 text-sm text-red-600">{errors.channel.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="movieId" className="block text-sm font-medium text-gray-800 mb-1">
                    Movie (Optional)
                </label>
                {isLoadingMovies ? (
                    <p className="text-sm text-gray-600">Loading movies...</p>
                ) : (
                    <select
                        id="movieId"
                        {...register("movieId")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                )}
                {errors.movieId && (
                    <p className="mt-1 text-sm text-red-600">{errors.movieId.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    );
}
