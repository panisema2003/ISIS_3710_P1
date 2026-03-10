"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Movie } from "@/modules/movies/types/movie.type";
import { Prize } from "@/modules/prizes/types/prize.type";
import { fetchMovieById, deleteMovie } from "@/modules/movies/services/movie.service";
import { fetchPrizes } from "@/modules/prizes/services/prize.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

interface MovieDetailPageProps {
    movieId: string;
}

export default function MovieDetailPage({ movieId }: MovieDetailPageProps) {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();

    const [movie, setMovie] = useState<Movie | null>(null);
    const [moviePrizes, setMoviePrizes] = useState<Prize[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                setIsLoading(true);
                const data = await fetchMovieById(movieId);
                setMovie(data);
                
                // Workaround: Backend doesn't include prizes in movie response
                // Fetch all prizes and filter those that contain this movie
                const allPrizes = await fetchPrizes();
                const prizesForMovie = allPrizes.filter(
                    (prize) => prize.movies?.some((m) => m.id === movieId)
                );
                setMoviePrizes(prizesForMovie);
            } catch (err) {
                setError(err instanceof Error ? err.message : t.movies.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadMovie();
    }, [movieId]);

    const handleDelete = async () => {
        if (!movie) return;

        if (!confirm(t.confirmDelete.replace("{name}", movie.title))) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteMovie(movie.id);
            showNotification(t.movies.deletedSuccess, "success");
            router.push("/movies");
        } catch (err) {
            showNotification(err instanceof Error ? err.message : t.movies.deleteError, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error || !movie) {
        return (
            <div className="text-center p-8" role="alert">
                <p className="text-red-500 mb-4">{t.error}: {error || t.movies.movieNotFound}</p>
                {/* Back arrow icon from tailwind docs */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <Link href="/movies" className="text-blue-600 hover:underline" aria-label={t.movies.backToMovies}>
                    {t.movies.backToMovies}
                </Link>
            </div>
        );
    }

    return (
        <article className="container mx-auto p-8" aria-label={movie.title}>
            <div className="flex items-center gap-2 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                <Link href="/movies" className="text-blue-600 hover:underline" aria-label={t.movies.backToMovies}>
                    {t.movies.backToMovies}
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="md:flex">
                    {/* Poster */}
                    <div className="md:w-1/3">
                        {movie.poster ? (
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="w-full h-96 md:h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-96 md:h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-6xl" aria-hidden="true">🎬</span>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-3xl font-bold">{movie.title}</h1>
                            <div className="flex gap-2">
                                <Link
                                    href={`/movies/${movie.id}/edit`}
                                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                                    aria-label={`${t.edit} ${movie.title}`}
                                >
                                    {t.edit}
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300"
                                    aria-label={`${t.delete} ${movie.title}`}
                                >
                                    {isDeleting ? t.deleting : t.delete}
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.movies.country}</span>
                                <p className="font-semibold text-gray-900">{movie.country}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.movies.durationLabel}</span>
                                <p className="font-semibold text-gray-900">{movie.duration} {t.movies.minutes}</p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.movies.releaseDate}</span>
                                <p className="font-semibold text-gray-900">
                                    {new Date(movie.releaseDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">{t.movies.popularity}</span>
                                <p className="font-semibold text-gray-900"><span aria-hidden="true">⭐</span> {movie.popularity}/5</p> {/*TODO: use a tailwind icon instead ow windows emoji, but im tired so later, same for all emojis basically*/}
                            </div>
                        </div>

                        {/* Genre */}
                        {movie.genre && (
                            <div className="mb-4">
                                <span className="text-gray-600 text-sm font-medium">{t.movies.genre}</span>
                                <p className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm ml-2 font-medium">
                                    {movie.genre.type}
                                </p>
                            </div>
                        )}

                        {/* Director */}
                        {movie.director && (
                            <div className="mb-4">
                                <span className="text-gray-600 text-sm font-medium">{t.movies.director}</span>
                                <p className="font-semibold text-gray-900">{movie.director.name}</p>
                            </div>
                        )}

                        {/* Platforms */}
                        {movie.platforms && movie.platforms.length > 0 && (
                            <div className="mb-4">
                                <span className="text-gray-600 text-sm font-medium block mb-2">{t.movies.availableOn}</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.platforms.map((platform) => (
                                        <span
                                            key={platform.id}
                                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {platform.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actors */}
                        {movie.actors && movie.actors.length > 0 && (
                            <div className="mb-4">
                                <span className="text-gray-600 text-sm font-medium block mb-2">{t.movies.cast}</span>
                                <div className="flex flex-wrap gap-2">
                                    {movie.actors.map((actor) => (
                                        <Link
                                            key={actor.id}
                                            href={`/actors/${actor.id}`}
                                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                                        >
                                            {actor.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Prizes */}
                <div className="border-t p-6">
                    <h2 className="text-xl font-bold mb-4"><span aria-hidden="true">🏆</span> {t.movies.prizes}</h2>
                    {moviePrizes.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {moviePrizes.map((prize) => (
                                <div
                                    key={prize.id}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        prize.status === "won"
                                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                            : "bg-gray-100 text-gray-800 border border-gray-300"
                                    }`}
                                >
                                    <span className="font-semibold">{prize.name}</span>
                                    <span className="mx-1">•</span>
                                    <span>{prize.category}</span>
                                    <span className="mx-1">•</span>
                                    <span>{prize.year}</span>
                                    <span className="ml-2 text-xs uppercase">
                                        ({prize.status})
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">{t.movies.noPrizesYet}</p>
                    )}
                </div>

                {/* YouTube Trailer Section */}
                {movie.youtubeTrailer && (
                    <div className="border-t p-6">
                        <h2 className="text-xl font-bold mb-4"><span aria-hidden="true">🎥</span> {t.movies.trailer}</h2>
                        <div className="bg-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900">{movie.youtubeTrailer.name}</p>
                                    <p className="text-sm text-gray-700">
                                        {t.movies.channel}: {movie.youtubeTrailer.channel} • {movie.youtubeTrailer.duration} sec
                                    </p>
                                </div>
                                <a
                                    href={movie.youtubeTrailer.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                    aria-label={t.movies.watchOnYoutube}
                                >
                                    {t.movies.watchOnYoutube}
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Section */}
                {movie.reviews && movie.reviews.length > 0 && (
                    <div className="border-t p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold"><span aria-hidden="true">📝</span> {t.movies.reviews} ({movie.reviews.length})</h2>
                            <Link
                                href={`/movies/${movie.id}/reviews/new`}
                                className="text-blue-600 hover:underline font-medium"
                                aria-label={t.movies.addReview}
                            >
                                {t.movies.addReview}
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {movie.reviews.slice(0, 3).map((review) => (
                                <div key={review.id} className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-gray-900">{review.creator}</span>
                                        <span className="text-yellow-600 font-medium"><span aria-hidden="true">⭐</span> {review.score}/5</span>
                                    </div>
                                    <p className="text-gray-700">{review.text}</p>
                                </div>
                            ))}
                            {movie.reviews.length > 3 && (
                                <Link
                                    href={`/movies/${movie.id}/reviews`}
                                    className="text-blue-600 hover:underline font-medium block text-center"
                                >
                                    {t.movies.viewAllReviews.replace("{count}", String(movie.reviews.length))}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                                

                            )}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
