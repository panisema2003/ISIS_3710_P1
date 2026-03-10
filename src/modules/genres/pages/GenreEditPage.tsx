"use client";

import { useState, useEffect } from "react";
import GenreForm from "../ui/GenreForm";
import { GenreFormData } from "../validation/genre.schema";
import { useRouter } from "next/navigation";
import { fetchGenreById, updateGenre } from "../services/genre.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

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
    const { t } = useI18n();

    useEffect(() => {
        const loadGenre = async () => {
            try {
                setIsLoading(true);
                const genre = await fetchGenreById(genreId);
                setDefaultValues({
                    type: genre.type,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : t.genres.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadGenre();
    }, [genreId, t]);

    const handleUpdateGenre = async (data: GenreFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateGenre(genreId, data);
            showNotification(t.genres.updatedSuccess, "success");
            router.push("/genres");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.genres.updateError);
            showNotification(t.genres.updateError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="container mx-auto p-8" role="status" aria-live="polite">
                <p>{t.genres.loadingGenre}</p>
            </section>
        );
    }

    if (error && !defaultValues) {
        return (
            <section className="container mx-auto p-8" role="alert">
                <p className="text-red-500">{t.error}: {error}</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto p-8" aria-labelledby="edit-genre-title">
            <h1 id="edit-genre-title" className="text-3xl font-bold mb-6">{t.genres.editTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <GenreForm
                onSubmit={handleUpdateGenre}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
