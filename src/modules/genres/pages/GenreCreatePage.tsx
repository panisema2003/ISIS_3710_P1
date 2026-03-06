"use client";

import { useState } from "react";
import GenreForm from "../ui/GenreForm";
import { GenreFormData } from "../validation/genre.schema";
import { useRouter } from "next/navigation";
import { createGenre } from "../services/genre.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function GenreCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleCreateGenre = async (data: GenreFormData) => {
        setIsSubmitting(true);
        try {
            await createGenre(data);
            showNotification("Genre created successfully!", "success");
            router.push("/genres");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while creating the genre.");
            showNotification("Failed to create genre.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Genre</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <GenreForm
                onSubmit={handleCreateGenre}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
