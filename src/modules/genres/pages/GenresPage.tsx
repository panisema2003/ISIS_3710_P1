"use client";

import { useState } from "react";
import { useGenres } from "@/modules/genres/hooks/useGenres";
import { Genre } from "@/modules/genres/types/genre.type";
import { deleteGenre } from "@/modules/genres/services/genre.service";
import Modal from "@/shared/ui/Modal";
import Link from "next/link";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function GenresPage() {
    const { genres, isLoading, error } = useGenres();
    const { t } = useI18n();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleGenreClick = (genre: Genre) => {
        setSelectedGenre(genre);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedGenre(null);
        setDeleteError(null);
    }

    const handleDelete = async () => {
        if (!selectedGenre) return;
        
        if (!confirm(t.confirmDelete.replace("{name}", selectedGenre.type))) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteGenre(selectedGenre.id);
            showNotification(t.genres.deletedSuccess, "success");
            handleCloseModal();
            window.location.reload();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : t.genres.deleteError);
            showNotification(t.genres.deleteError, "error");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t.genres.title}</h1>
                <Link
                    href="/genres/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                    aria-label={t.genres.newGenre}
                >
                    {t.genres.newGenre}
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list">
                {genres.map((genre) => (
                    <div
                        key={genre.id}
                        role="listitem"
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                        onClick={() => handleGenreClick(genre)}
                        tabIndex={0}
                        aria-label={genre.type}
                        onKeyDown={(e) => e.key === "Enter" && handleGenreClick(genre)}
                    >
                        <h2 className="text-lg font-semibold text-center">{genre.type}</h2>
                        {genre.movies && (
                            <p className="text-gray-500 text-sm text-center mt-1">
                                {genre.movies.length} {t.genres.movieCount}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedGenre ? selectedGenre.type : t.genres.genreDetails}
            >
                {selectedGenre && (
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <span className="text-4xl" aria-hidden="true">🎬</span>
                            <h2 className="text-2xl font-bold mt-2">{selectedGenre.type}</h2>
                        </div>

                        {selectedGenre.movies && selectedGenre.movies.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">{t.genres.moviesInGenre}</h3>
                                <div className="flex flex-wrap gap-2" role="list">
                                    {selectedGenre.movies.map((movie) => (
                                        <span
                                            key={movie.id}
                                            role="listitem"
                                            className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                                        >
                                            {movie.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {deleteError && (
                            <p className="text-red-500 text-sm" role="alert">{deleteError}</p>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={`/genres/${selectedGenre.id}/edit`}
                                className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                                aria-label={`${t.edit} ${selectedGenre.type}`}
                            >
                                {t.edit}
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                aria-label={`${t.delete} ${selectedGenre.type}`}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300"
                            >
                                {isDeleting ? t.deleting : t.delete}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
