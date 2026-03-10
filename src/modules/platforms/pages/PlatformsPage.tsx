"use client";

import { useState } from "react";
import { usePlatforms } from "@/modules/platforms/hooks/usePlatforms";
import { Platform } from "@/modules/platforms/types/platform.type";
import { deletePlatform } from "@/modules/platforms/services/platform.service";
import Modal from "@/shared/ui/Modal";
import Link from "next/link";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function PlatformsPage() {
    const { platforms, isLoading, error } = usePlatforms();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    const handlePlatformClick = (platform: Platform) => {
        setSelectedPlatform(platform);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPlatform(null);
        setDeleteError(null);
    }

    const handleDelete = async () => {
        if (!selectedPlatform) return;
        
        if (!confirm(t.confirmDelete.replace("{name}", selectedPlatform.name))) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deletePlatform(selectedPlatform.id);
            showNotification(t.platforms.deletedSuccess, "success");
            handleCloseModal();
            window.location.reload();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : t.platforms.deleteError);
            showNotification(t.platforms.deleteError, "error");
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
                <h1 className="text-3xl font-bold">{t.platforms.title}</h1>
                <Link
                    href="/platforms/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                    aria-label={t.platforms.newPlatform}
                >
                    {t.platforms.newPlatform}
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" role="list" aria-label={t.platforms.title}>
                {platforms.map((platform) => (
                    <div
                        key={platform.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
                        onClick={() => handlePlatformClick(platform)}
                        role="listitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handlePlatformClick(platform)}
                        aria-label={platform.name}
                    >
                        <h2 className="text-lg font-semibold">{platform.name}</h2>
                        <p className="text-blue-500 text-sm mt-1 truncate">{platform.url}</p>
                        {platform.movies && (
                            <p className="text-gray-500 text-sm mt-1">
                                {platform.movies.length} {t.platforms.movieCount}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedPlatform ? selectedPlatform.name : t.platforms.platformDetails}
            >
                {selectedPlatform && (
                    <div className="space-y-4">
                        <div className="text-center py-4">
                            <span className="text-4xl" aria-hidden="true">📺</span>
                            <h2 className="text-2xl font-bold mt-2">{selectedPlatform.name}</h2>
                            <a 
                                href={selectedPlatform.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-sm"
                            >
                                {selectedPlatform.url}
                            </a>
                        </div>

                        {selectedPlatform.movies && selectedPlatform.movies.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-2">{t.platforms.availableMovies}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedPlatform.movies.map((movie) => (
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
                            <p className="text-red-500 text-sm" role="alert">{deleteError}</p>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href={`/platforms/${selectedPlatform.id}/edit`}
                                className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                                aria-label={`${t.edit} ${selectedPlatform.name}`}
                            >
                                {t.edit}
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300"
                                aria-label={`${t.delete} ${selectedPlatform.name}`}
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
