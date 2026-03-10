"use client";

import { useState } from "react";
import PlatformForm from "../ui/PlatformForm";
import { PlatformFormData } from "../validation/platform.schema";
import { useRouter } from "next/navigation";
import { createPlatform } from "../services/platform.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function PlatformCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);
    const { t } = useI18n();

    const handleCreatePlatform = async (data: PlatformFormData) => {
        setIsSubmitting(true);
        try {
            await createPlatform(data);
            showNotification(t.platforms.createdSuccess, "success");
            router.push("/platforms");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.platforms.createError);
            showNotification(t.platforms.createError, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-platform-title">
            <h1 id="create-platform-title" className="text-3xl font-bold mb-6">{t.platforms.createTitle}</h1>
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <PlatformForm
                onSubmit={handleCreatePlatform}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}
