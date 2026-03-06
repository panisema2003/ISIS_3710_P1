"use client";

import { useState } from "react";
import { useActors } from "@/modules/actors/hooks/useActors";
import { Actor } from "@/modules/actors/types/actor.type";
import Modal from "@/shared/ui/Modal";

export default function ActorsPage() {
    // custom hook baby
    const { actors, isLoading, error } = useActors();

    // state for modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);

    const handleServiceClick = (actor: Actor) => {
        setSelectedActor(actor);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedActor(null);
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
            <h1 className="text-3xl font-bold mb-5">List of Actors</h1>
            <ul className="space-y-4">
                {actors.map((Actor) => (
                    <li
                        key={Actor.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleServiceClick(Actor)} // make item clickable
                    > 
                        <h2 className="text-xl font-semibold">{Actor.name}</h2>
                        <p className="text-gray-600 mt-2">{Actor.biography}</p>
                    </li>
                ))}
            </ul>

            {/* Render the modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedActor ? selectedActor.name : "Actor Details"}
            >
                {/* Modal content */}
                <p>{selectedActor?.biography}</p>
                <p className="mt-4 text-sm text-gray-500">
                    Actor's ID: {selectedActor?.id}
                </p>
            </Modal>
        </div>
    );
}