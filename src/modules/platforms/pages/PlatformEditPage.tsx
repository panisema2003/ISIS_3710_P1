"use client";

import { useState, useEffect } from "react";
import PlatformForm from "../ui/PlatformForm";
import { PlatformFormData } from "../validation/platform.schema";
import { useRouter } from "next/navigation";
import { fetchPlatformById, updatePlatform } from "../services/platform.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

interface PlatformEditPageProps {
    platformId: string;
}

export default function PlatformEditPage({ platformId }: PlatformEditPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [defaultValues, setDefaultValues] = useState<PlatformFormData | undefined>(undefined);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    useEffect(() => {
        const loadPlatform = async () => {
            try {
                setIsLoading(true);
                const platform = await fetchPlatformById(platformId);
                setDefaultValues({
                    name: platform.name,
                    url: platform.url,
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : t.platforms.loadError);
            } finally {
                setIsLoading(false);
            }
        };
        loadPlatform();
    }, [platformId]);

    const handleUpdatePlatform = async (data: PlatformFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updatePlatform(platformId, data);
            showNotification(t.platforms.updatedSuccess, "success");
            router.push("/platforms");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.platforms.updateError);
            showNotification(t.platforms.updateError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <section className="container mx-auto p-8">
                <p role="status" aria-live="polite">{t.platforms.loadingPlatform}</p>
            </section>
        );
    }

    if (error && !defaultValues) {
        return (
            <section className="container mx-auto p-8">
                <p className="text-red-500" role="alert">{t.error}: {error}</p>
            </section>
        );
    }

    return (
        <section className="container mx-auto p-8" aria-labelledby="edit-platform-title">
            <h1 id="edit-platform-title" className="text-3xl font-bold mb-6">{t.platforms.editTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <PlatformForm
                onSubmit={handleUpdatePlatform}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
