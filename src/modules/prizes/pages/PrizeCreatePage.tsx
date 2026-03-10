"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrize } from "@/modules/prizes/services/prize.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import PrizeForm from "@/modules/prizes/ui/PrizeForm";
import { PrizeFormData } from "@/modules/prizes/validation/prize.schema";
import { useI18n } from "@/shared/i18n/I18nContext";

export default function PrizeCreatePage() {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useI18n();

    const handleSubmit = async (data: PrizeFormData) => {
        setIsSubmitting(true);
        try {
            await createPrize(data);
            showNotification(t.prizesSection.createdSuccess, "success");
            router.push("/prizes");
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : t.prizesSection.createError,
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="container mx-auto p-8" aria-labelledby="create-prize-title">
            <h1 id="create-prize-title" className="text-3xl font-bold mb-6 text-blue-600">{t.prizesSection.createTitle}</h1>
            <div className="max-w-xl">
                <PrizeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </section>
    );
}
