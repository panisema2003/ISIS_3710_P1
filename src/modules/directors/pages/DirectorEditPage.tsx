"use client";

import { useState, useEffect } from "react";
import DirectorForm from "../ui/DirectorForm";
import { DirectorFormData } from "../validation/director.schema";
import { useRouter } from "next/navigation";
import { fetchDirectorById, updateDirector } from "../services/director.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

interface DirectorEditPageProps {
    directorId: string;
}

export default function DirectorEditPage({ directorId }: DirectorEditPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultValues, setDefaultValues] = useState<DirectorFormData | undefined>(undefined);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    useEffect(() => {
        const loadDirector = async () => {
            try {
                setIsLoading(true);
                const director = await fetchDirectorById(directorId);
                setDefaultValues({
                    name: director.name,
                    photo: director.photo,
                    nationality: director.nationality,
                    birthDate: director.birthDate.split("T")[0],
                    biography: director.biography,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : t.directors.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadDirector();
    }, [directorId, t]);

    const handleUpdateDirector = async (data: DirectorFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateDirector(directorId, data);
            showNotification(t.directors.updatedSuccess, "success");
            router.push("/directors");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.directors.updateError);
            showNotification(t.directors.updateError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="container mx-auto p-8" role="status" aria-live="polite">
                <p>{t.directors.loadingDirector}</p>
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
        <section className="container mx-auto p-8" aria-labelledby="edit-director-title">
            <h1 id="edit-director-title" className="text-3xl font-bold mb-6">{t.directors.editTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <DirectorForm
                onSubmit={handleUpdateDirector}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
