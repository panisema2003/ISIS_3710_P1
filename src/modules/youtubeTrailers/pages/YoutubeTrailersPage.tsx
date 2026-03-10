"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useYoutubeTrailers } from "@/modules/youtubeTrailers/hooks/useYoutubeTrailers";
import { YoutubeTrailer } from "@/modules/youtubeTrailers/types/youtubeTrailer.type";
import { deleteYoutubeTrailer } from "@/modules/youtubeTrailers/services/youtubeTrailer.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import Modal from "@/shared/ui/Modal";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function YoutubeTrailersPage() {
    const { youtubeTrailers, isLoading, error } = useYoutubeTrailers();
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const { t } = useI18n();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState<YoutubeTrailer | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleTrailerClick = (trailer: YoutubeTrailer) => {
        setSelectedTrailer(trailer);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTrailer(null);
    }

    const handleEdit = () => {
        if (selectedTrailer) {
            router.push(`/youtube-trailers/${selectedTrailer.id}/edit`);
        }
    };

    const handleDelete = async () => {
        if (!selectedTrailer) return;
        
        if (!confirm(t.confirmDelete.replace("{name}", selectedTrailer.name))) {
            return;
        }

        setIsDeleting(true);
        try {
            await deleteYoutubeTrailer(selectedTrailer.id);
            showNotification(t.trailers.deletedSuccess, "success");
            handleCloseModal();
            router.refresh();
            window.location.reload();
        } catch (err) {
            showNotification(err instanceof Error ? err.message : t.trailers.deleteError, "error");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8" role="status" aria-live="polite">{t.loading}</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500" role="alert">{t.error}: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t.trailers.title}</h1>
                <button
                    onClick={() => router.push("/youtube-trailers/new")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    aria-label={t.trailers.addTrailer}
                >
                    {t.trailers.addTrailer}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label={t.trailers.title}>
                {youtubeTrailers.map((trailer) => (
                    <div
                        key={trailer.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                        onClick={() => handleTrailerClick(trailer)}
                        role="listitem"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleTrailerClick(trailer)}
                        aria-label={trailer.name}
                    >
                        <div className="w-full h-40 bg-red-100 flex items-center justify-center">
                            <span className="text-red-500 text-4xl" aria-hidden="true">▶️</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-lg font-semibold truncate">{trailer.name}</h2>
                            <p className="text-sm text-gray-500">{trailer.channel}</p>
                            <p className="text-sm text-gray-400">{Math.floor(trailer.duration / 60)}:{(trailer.duration % 60).toString().padStart(2, '0')}</p> {/*Just cool format*/}
                        </div>
                    </div>
                ))}
            </div>

            <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedTrailer?.name || t.trailers.trailerDetails}
            >
                {selectedTrailer && (
                    <div className="space-y-4">
                        <div className="space-y-2 text-sm">
                            <p><strong>{t.trailers.channel}:</strong> {selectedTrailer.channel}</p>
                            <p><strong>{t.trailers.durationSeconds}:</strong> {Math.floor(selectedTrailer.duration / 60)}:{(selectedTrailer.duration % 60).toString().padStart(2, '0')}</p>
                            <p><strong>URL:</strong> <a href={selectedTrailer.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{selectedTrailer.url}</a></p>
                            {selectedTrailer.movie && (
                                <p><strong>Movie:</strong> {selectedTrailer.movie.title}</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-400">ID: {selectedTrailer.id}</p>
                        
                        <div className="flex gap-3 pt-4 border-t">
                            <button
                                onClick={handleEdit}
                                className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors"
                                aria-label={`${t.edit} ${selectedTrailer.name}`}
                            >
                                {t.edit}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                aria-label={`${t.delete} ${selectedTrailer.name}`}
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
