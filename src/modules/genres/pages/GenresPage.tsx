"use client";

import { useState } from "react";
import { useGenres } from "@/modules/genres/hooks/useGenres";
import { Genre } from "@/modules/genres/types/genre.type";
import { deleteGenre } from "@/modules/genres/services/genre.service";
import Modal from "@/shared/ui/Modal";
import Link from "next/link";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function GenresPage() {
    const { genres, isLoading, error } = useGenres();

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
        
        if (!confirm(`Are you sure you want to delete "${selectedGenre.type}"?`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteGenre(selectedGenre.id);
            showNotification("Genre deleted successfully!", "success");
            handleCloseModal();
            window.location.reload();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete genre");
            showNotification("Failed to delete genre.", "error");
        } finally {
            setIsDeleting(false);
        }
    }

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">List of Genres</h1>
                <Link
                    href="/genres/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                >
                    + New Genre
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {genres.map((genre) => (
                    <div
                        key={genre.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                        onClick={() => handleGenreClick(genre)}
                    >
                        <h2 className="text-lg font-semibold text-center">{genre.type}</h2>
                        {genre.movies && (
                            <p className="text-gray-500 text-sm text-center mt-1">
                                {genre.movies.length} movie(s)
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedGenre ? selectedGenre.type : "Genre Details"}
            >
                {selectedGenre && (
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <span className="text-4xl">🎬</span> {/** pretty huh! */}
                            <h2 className="text-2xl font-bold mt-2">{selectedGenre.type}</h2>
                        </div>

                        {selectedGenre.movies && selectedGenre.movies.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">Movies in this genre</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedGenre.movies.map((movie) => (
                                        <span
                                            key={movie.id}
                                            className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                                        >
                                            {movie.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {deleteError && (
                            <p className="text-red-500 text-sm">{deleteError}</p>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={`/genres/${selectedGenre.id}/edit`}
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
                )}
            </Modal>
        </div>
    );
}
