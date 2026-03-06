"use client";

import { useState } from "react";
import { useActors } from "@/modules/actors/hooks/useActors";
import { Actor } from "@/modules/actors/types/actor.type";
import { deleteActor } from "@/modules/actors/services/actor.service";
import Modal from "@/shared/ui/Modal";
import Link from "next/link";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function ActorsPage() {
    // custom hook baby
    const { actors, isLoading, error } = useActors();

    // state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleServiceClick = (actor: Actor) => {
        setSelectedActor(actor);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedActor(null);
        setDeleteError(null);
    }

    const handleDelete = async () => {
        if (!selectedActor) return;
        
        if (!confirm(`Are you sure you want to delete "${selectedActor.name}"?`)) {
            return;
        }

        setIsDeleting(true);
        setDeleteError(null);
        try {
            await deleteActor(selectedActor.id);
            showNotification("Actor deleted successfully!", "success");
            handleCloseModal();
            // Refresh the page to update the list
            window.location.reload();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete actor");
            showNotification("Failed to delete actor.", "error");
        } finally {
            setIsDeleting(false);
        }
    }

    // state based conditional rendering (no more modal)
    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">List of Actors</h1>
                <Link
                    href="/actors/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                >
                    + New Actor
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actors.map((actor) => (
                    <div
                        key={actor.id}
                        className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                        onClick={() => handleServiceClick(actor)}
                    >
                        <div className="h-48 overflow-hidden bg-gray-100">
                            <img
                                src={actor.photo}
                                alt={actor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{actor.name}</h2>
                            <p className="text-gray-500 text-sm mt-1">{actor.nationality}</p>
                            <p className="text-gray-600 mt-2 line-clamp-2">{actor.biography}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedActor ? selectedActor.name : "Actor Details"}
            >
                {selectedActor && (
                    <div className="space-y-4">
                        {/* Actor photo */}
                        <div className="w-full h-56 rounded-lg overflow-hidden bg-gray-100">
                            <img
                                src={selectedActor.photo}
                                alt={selectedActor.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Actor details */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">Nationality:</span>
                                <span>{selectedActor.nationality}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">Birth Date:</span>
                                <span>{new Date(selectedActor.birthDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Biography */}
                        <div>
                            <h3 className="font-medium text-gray-700 mb-1">Biography</h3>
                            <p className="text-gray-600 text-sm">{selectedActor.biography}</p>
                        </div>

                        {/* Movies */}
                        {selectedActor.movies && selectedActor.movies.length > 0 && (
                            <div>
                                <h3 className="font-medium text-gray-700 mb-1">Movies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedActor.movies.map((movie) => (
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

                        {/* Action buttons */}
                        <div className="flex gap-3 pt-2">
                            <Link
                                href={`/actors/${selectedActor.id}/edit`}
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