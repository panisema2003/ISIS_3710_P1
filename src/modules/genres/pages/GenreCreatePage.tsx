"use client";

import { useState } from "react";
import GenreForm from "../ui/GenreForm";
import { GenreFormData } from "../validation/genre.schema";
import { useRouter } from "next/navigation";
import { createGenre } from "../services/genre.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function GenreCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    const handleCreateGenre = async (data: GenreFormData) => {
        setIsSubmitting(true);
        try {
            await createGenre(data);
            showNotification(t.genres.createdSuccess, "success");
            router.push("/genres");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.genres.createError);
            showNotification(t.genres.createError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-genre-title">
            <h1 id="create-genre-title" className="text-3xl font-bold mb-6">{t.genres.createTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <GenreForm
                onSubmit={handleCreateGenre}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
