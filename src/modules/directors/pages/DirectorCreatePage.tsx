"use client";

import { useState } from "react";
import DirectorForm from "../ui/DirectorForm";
import { DirectorFormData } from "../validation/director.schema";
import { useRouter } from "next/navigation";
import { createDirector } from "../services/director.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function DirectorCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    const handleCreateDirector = async (data: DirectorFormData) => {
        setIsSubmitting(true);
        try {
            await createDirector(data);
            showNotification(t.directors.createdSuccess, "success");
            router.push("/directors");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.directors.createError);
            showNotification(t.directors.createError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-director-title">
            <h1 id="create-director-title" className="text-3xl font-bold mb-6">{t.directors.createTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <DirectorForm
                onSubmit={handleCreateDirector}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
