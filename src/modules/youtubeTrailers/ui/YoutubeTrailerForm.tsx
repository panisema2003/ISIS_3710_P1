"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { youtubeTrailerSchema, YoutubeTrailerFormData } from "@/modules/youtubeTrailers/validation/youtubeTrailer.schema";
import { Movie } from "@/modules/movies/types/movie.type";
import { useI18n } from "@/shared/i18n/I18nContext";

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
    const { t } = useI18n();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<YoutubeTrailerFormData>({
        resolver: zodResolver(youtubeTrailerSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl" aria-label={t.trailers.title}>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.trailers.name} *
                </label>
                <input
                    type="text"
                    id="name"
                    {...register("name")}
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.trailers.namePlaceholder}
                />
                {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.trailers.url} *
                </label>
                <input
                    type="url"
                    id="url"
                    {...register("url")}
                    aria-required="true"
                    aria-invalid={!!errors.url}
                    aria-describedby={errors.url ? "url-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.trailers.urlPlaceholder}
                />
                {errors.url && (
                    <p id="url-error" className="mt-1 text-sm text-red-600" role="alert">{errors.url.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.trailers.durationSeconds} *
                </label>
                <input
                    type="number"
                    id="duration"
                    {...register("duration", { valueAsNumber: true })}
                    aria-required="true"
                    aria-invalid={!!errors.duration}
                    aria-describedby={errors.duration ? "duration-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.trailers.durationPlaceholder}
                />
                {errors.duration && (
                    <p id="duration-error" className="mt-1 text-sm text-red-600" role="alert">{errors.duration.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="channel" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.trailers.channel} *
                </label>
                <input
                    type="text"
                    id="channel"
                    {...register("channel")}
                    aria-required="true"
                    aria-invalid={!!errors.channel}
                    aria-describedby={errors.channel ? "channel-error" : undefined}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t.trailers.channelPlaceholder}
                />
                {errors.channel && (
                    <p id="channel-error" className="mt-1 text-sm text-red-600" role="alert">{errors.channel.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="movieId" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.trailers.movieOptional}
                </label>
                {isLoadingMovies ? (
                    <p className="text-sm text-gray-600" role="status" aria-live="polite">{t.trailers.loadingMovies}</p>
                ) : (
                    <select
                        id="movieId"
                        {...register("movieId")}
                        aria-invalid={!!errors.movieId}
                        aria-describedby={errors.movieId ? "movieId-error" : undefined}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">{t.trailers.selectMovie}</option>
                        {movies.map((movie) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.title}
                            </option>
                        ))}
                    </select>
                )}
                {errors.movieId && (
                    <p id="movieId-error" className="mt-1 text-sm text-red-600" role="alert">{errors.movieId.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? t.saving : submitLabel}
            </button>
        </form>
    );
}
