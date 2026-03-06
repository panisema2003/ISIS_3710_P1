"use client";

import { useState, useEffect } from "react";
import GenreForm from "../ui/GenreForm";
import { GenreFormData } from "../validation/genre.schema";
import { useRouter } from "next/navigation";
import { fetchGenreById, updateGenre } from "../services/genre.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

interface GenreEditPageProps {
    genreId: string;
}

export default function GenreEditPage({ genreId }: GenreEditPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultValues, setDefaultValues] = useState<GenreFormData | undefined>(undefined);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);

    useEffect(() => {
        const loadGenre = async () => {
            try {
                setIsLoading(true);
                const genre = await fetchGenreById(genreId);
                setDefaultValues({
                    type: genre.type,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load genre");
            } finally {
                setIsLoading(false);
            }
        };
        loadGenre();
    }, [genreId]);

    const handleUpdateGenre = async (data: GenreFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateGenre(genreId, data);
            showNotification("Genre updated successfully!", "success");
            router.push("/genres");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while updating the genre.");
            showNotification("Failed to update genre.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container mx-auto p-8">
                <p>Loading genre...</p>
            </main>
        );
    }

    if (error && !defaultValues) {
        return (
            <main className="container mx-auto p-8">
                <p className="text-red-500">Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Genre</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <GenreForm
                onSubmit={handleUpdateGenre}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
