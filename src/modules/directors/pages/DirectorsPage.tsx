"use client";

import { useState } from "react";
import { useDirectors } from "@/modules/directors/hooks/useDirectors";
import { Director } from "@/modules/directors/types/director.type";
import { deleteDirector } from "@/modules/directors/services/director.service";
import Modal from "@/shared/ui/Modal";
import Link from "next/link";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function DirectorsPage() {
    const { directors, isLoading, error } = useDirectors();
    const { t } = useI18n();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleDirectorClick = (director: Director) => {
        setSelectedDirector(director);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDirector(null);
        setDeleteError(null);
    }

    const handleDelete = async () => {
        if (!selectedDirector) return;
        
        if (!confirm(t.confirmDelete.replace("{name}", selectedDirector.name))) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteDirector(selectedDirector.id);
            showNotification(t.directors.deletedSuccess, "success");
            handleCloseModal();
            window.location.reload();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : t.directors.deleteError);
            showNotification(t.directors.deleteError, "error");
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
                <h1 className="text-3xl font-bold">{t.directors.title}</h1>
                <Link
                    href="/directors/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                    aria-label={t.directors.newDirector}
                >
                    {t.directors.newDirector}
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
                {directors.map((director) => (
                    <div
                        key={director.id}
                        role="listitem"
                        className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                        onClick={() => handleDirectorClick(director)}
                        tabIndex={0}
                        aria-label={director.name}
                        onKeyDown={(e) => e.key === "Enter" && handleDirectorClick(director)}
                    >
                        <div className="h-48 overflow-hidden bg-gray-100">
                            <img
                                src={director.photo}
                                alt={director.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{director.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">{director.nationality}</p>
                            <p className="text-gray-600 mt-2 line-clamp-2">{director.biography}</p>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedDirector ? selectedDirector.name : t.directors.directorDetails}
            >
                {selectedDirector && (
                    <div className="space-y-4">
                        <div className="w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={selectedDirector.photo}
                                alt={selectedDirector.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">{t.directors.nationality}:</span>
                                <span>{selectedDirector.nationality}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">{t.directors.birthDate}:</span>
                                <span>{new Date(selectedDirector.birthDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-700 mb-1">{t.directors.biography}</h3>
                            <p className="text-gray-600 text-sm">{selectedDirector.biography}</p>
                        </div>

                        {selectedDirector.movies && selectedDirector.movies.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-1">{t.directors.moviesDirected}</h3>
                                <div className="flex flex-wrap gap-2" role="list">
                                    {selectedDirector.movies.map((movie) => (
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
                                href={`/directors/${selectedDirector.id}/edit`}
                                className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                                aria-label={`${t.edit} ${selectedDirector.name}`}
                            >
                                {t.edit}
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                aria-label={`${t.delete} ${selectedDirector.name}`}
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
