"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrize } from "@/modules/prizes/services/prize.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";
import PrizeForm from "@/modules/prizes/ui/PrizeForm";
import { PrizeFormData } from "@/modules/prizes/validation/prize.schema";

export default function PrizeCreatePage() {
    const router = useRouter();
    const { showNotification } = useNotificationStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (data: PrizeFormData) => {
        setIsSubmitting(true);
        try {
            await createPrize(data);
            showNotification("Prize created successfully!", "success");
            router.push("/prizes");
        } catch (error) {
            showNotification(
                error instanceof Error ? error.message : "Failed to create prize",
                "error"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-600">Create New Prize</h1>
            <div className="max-w-xl">
                <PrizeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </div>
    );
}
