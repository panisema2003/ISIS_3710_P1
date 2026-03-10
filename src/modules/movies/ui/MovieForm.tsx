"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MovieFormData, MovieSchema } from "@/modules/movies/validation/movie.schema";
import { Director } from "@/modules/directors/types/director.type";
import { Genre } from "@/modules/genres/types/genre.type";
import { Actor } from "@/modules/actors/types/actor.type";
import { Platform } from "@/modules/platforms/types/platform.type";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { Prize } from "@/modules/prizes/types/prize.type";
import { useI18n } from "@/shared/i18n/I18nContext";

interface MovieFormProps {
    onSubmit: SubmitHandler<MovieFormData>;
    defaultValues?: Partial<MovieFormData>;
    submitLabel?: string;
    directors?: Director[];
    genres?: Genre[];
    actors?: Actor[];
    platforms?: Platform[];
    youtubeTrailers?: YoutubeTrailer[];
    usedTrailerIds?: string[]; // Ids of trailers already assigned to other movies
    currentTrailerId?: string; // Only for edit, keep current trailer available to select
    prizes?: Prize[];
    isLoadingRelations?: boolean;
}

export default function MovieForm({
    onSubmit,
    defaultValues,
    submitLabel = "Save Movie",
    directors = [],
    genres = [],
    actors = [],
    platforms = [],
    youtubeTrailers = [],
    usedTrailerIds = [],
    currentTrailerId,
    prizes = [],
    isLoadingRelations = false,
}: MovieFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MovieFormData>({
        resolver: zodResolver(MovieSchema),
        defaultValues,
    });
    const { t } = useI18n();

    // Filter out trailers that are already used by other movies
    // Keep the current trailer available in edit mode
    const availableTrailers = useMemo(() => {
        return youtubeTrailers.filter(
            (trailer) => !usedTrailerIds.includes(trailer.id) || trailer.id === currentTrailerId
        );
    }, [youtubeTrailers, usedTrailerIds, currentTrailerId]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-label={t.movies.saveMovie}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.movieTitle}
                    </label>
                    <input
                        id="title"
                        {...register("title")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                        aria-invalid={!!errors.title}
                        aria-describedby={errors.title ? "title-error" : undefined}
                    />
                    {errors.title && (
                        <p id="title-error" className="text-red-600 text-sm mt-1" role="alert">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="poster" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.posterUrl}
                    </label>
                    <input
                        id="poster"
                        type="url"
                        {...register("poster")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/poster.jpg"
                        aria-invalid={!!errors.poster}
                        aria-describedby={errors.poster ? "poster-error" : undefined}
                    />
                    {errors.poster && (
                        <p id="poster-error" className="text-red-600 text-sm mt-1" role="alert">{errors.poster.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.duration}
                    </label>
                    <input
                        id="duration"
                        type="number"
                        {...register("duration", { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                        aria-invalid={!!errors.duration}
                        aria-describedby={errors.duration ? "duration-error" : undefined}
                    />
                    {errors.duration && (
                        <p id="duration-error" className="text-red-600 text-sm mt-1" role="alert">{errors.duration.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.country}
                    </label>
                    <input
                        id="country"
                        {...register("country")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                        aria-invalid={!!errors.country}
                        aria-describedby={errors.country ? "country-error" : undefined}
                    />
                    {errors.country && (
                        <p id="country-error" className="text-red-600 text-sm mt-1" role="alert">{errors.country.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.releaseDate}
                    </label>
                    <input
                        id="releaseDate"
                        type="date"
                        {...register("releaseDate")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                        aria-invalid={!!errors.releaseDate}
                        aria-describedby={errors.releaseDate ? "releaseDate-error" : undefined}
                    />
                    {errors.releaseDate && (
                        <p id="releaseDate-error" className="text-red-600 text-sm mt-1" role="alert">{errors.releaseDate.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="popularity" className="block text-sm font-medium text-gray-800 mb-1">
                        {t.movies.popularityRange}
                    </label>
                    <input
                        id="popularity"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        {...register("popularity", { valueAsNumber: true })}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                        aria-invalid={!!errors.popularity}
                        aria-describedby={errors.popularity ? "popularity-error" : undefined}
                    />
                    {errors.popularity && (
                        <p id="popularity-error" className="text-red-600 text-sm mt-1" role="alert">{errors.popularity.message}</p>
                    )}
                </div>
            </div>

            {/* Director Select */}
            <div>
                <label htmlFor="directorId" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.movies.director}
                </label>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingDirectors}</p>
                ) : (
                    <select
                        id="directorId"
                        {...register("directorId")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                    >
                        <option value="">{t.movies.selectDirector}</option>
                        {directors.map((director) => (
                            <option key={director.id} value={director.id}>
                                {director.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Genre Select */}
            <div>
                <label htmlFor="genreId" className="block text-sm font-medium text-gray-800 mb-1">
                    {t.movies.genre}
                </label>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingGenres}</p>
                ) : (
                    <select
                        id="genreId"
                        {...register("genreId")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                    >
                        <option value="">{t.movies.selectGenre}</option>
                        {genres.map((genre) => (
                            <option key={genre.id} value={genre.id}>
                                {genre.type}
                            </option>
                        ))}
                    </select>
                )}
                {errors.genreId && (
                    <p className="text-red-600 text-sm mt-1" role="alert">{errors.genreId.message}</p>
                )}
            </div>

            {/* YouTube Trailer Select */}
            <div>
                <div className="flex items-center justify-between mb-1">
                    <label htmlFor="youtubeTrailerId" className="block text-sm font-medium text-gray-800">
                        {t.movies.youtubeTrailer}
                    </label>
                    <Link
                        href="/youtube-trailers/new"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {t.movies.createNewTrailer}
                    </Link>
                </div>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingTrailers}</p>
                ) : availableTrailers.length === 0 ? (
                    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                            {t.movies.noTrailersAvailable}
                        </p>
                        <Link
                            href="/youtube-trailers/new"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline mt-1 inline-block"
                        >
                            {t.movies.createTrailerLink}
                        </Link>
                    </div>
                ) : (
                    <select
                        id="youtubeTrailerId"
                        {...register("youtubeTrailerId")}
                        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-required="true"
                    >
                        <option value="">{t.movies.selectTrailer}</option>
                        {availableTrailers.map((trailer) => (
                            <option key={trailer.id} value={trailer.id}>
                                {trailer.name} ({trailer.channel})
                            </option>
                        ))}
                    </select>
                )}
                {errors.youtubeTrailerId && (
                    <p className="text-red-600 text-sm mt-1" role="alert">{errors.youtubeTrailerId.message}</p>
                )}
            </div>

            {/* Actors Multi select (predict al parcial) */}
            <fieldset>
                <legend className="block text-sm font-medium text-gray-800 mb-2">
                    {t.movies.actorsLabel}
                </legend>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingActors}</p>
                ) : actors.length === 0 ? (
                    <p className="text-gray-600">{t.movies.noActorsAvailable}</p>
                ) : (
                    <div className="bg-white border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                        {actors.map((actor) => (
                            <div key={actor.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`actor-${actor.id}`}
                                    value={actor.id}
                                    {...register("actorIds")}
                                    className="mr-2 h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={`actor-${actor.id}`} className="text-sm text-gray-800">
                                    {actor.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </fieldset>

            {/* Platforms Multi select */}
            <fieldset>
                <legend className="block text-sm font-medium text-gray-800 mb-2">
                    {t.movies.platformsLabel}
                </legend>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingPlatforms}</p>
                ) : platforms.length === 0 ? (
                    <p className="text-gray-600">{t.movies.noPlatformsAvailable}</p>
                ) : (
                    <div className="bg-white border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                        {platforms.map((platform) => (
                            <div key={platform.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`platform-${platform.id}`}
                                    value={platform.id}
                                    {...register("platformIds")}
                                    className="mr-2 h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={`platform-${platform.id}`} className="text-sm text-gray-800">
                                    {platform.name}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </fieldset>

            {/* Prizes Multi-select (Optional) */}
            <fieldset>
                <legend className="block text-sm font-medium text-gray-800 mb-2">
                    {t.movies.prizesOptional}
                </legend>
                {isLoadingRelations ? (
                    <p className="text-gray-600" role="status">{t.movies.loadingPrizes}</p>
                ) : prizes.length === 0 ? (
                    <p className="text-gray-600">{t.movies.noPrizesAvailable}</p>
                ) : (
                    <div className="bg-white border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                        {prizes.map((prize) => (
                            <div key={prize.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`prize-${prize.id}`}
                                    value={prize.id}
                                    {...register("prizeIds")}
                                    className="mr-2 h-4 w-4 text-blue-600"
                                />
                                <label htmlFor={`prize-${prize.id}`} className="text-sm text-gray-800">
                                    {prize.name} - {prize.category} ({prize.year})
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </fieldset>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
                aria-busy={isSubmitting}
            >
                {isSubmitting ? t.saving : submitLabel}
            </button>
        </form>
    );
}
