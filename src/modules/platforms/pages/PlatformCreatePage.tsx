"use client";

import { useState } from "react";
import PlatformForm from "../ui/PlatformForm";
import { PlatformFormData } from "../validation/platform.schema";
import { useRouter } from "next/navigation";
import { createPlatform } from "../services/platform.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function PlatformCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleCreatePlatform = async (data: PlatformFormData) => {
        setIsSubmitting(true);
        try {
            await createPlatform(data);
            showNotification("Platform created successfully!", "success");
            router.push("/platforms");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while creating the platform.");
            showNotification("Failed to create platform.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Platform</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <PlatformForm
                onSubmit={handleCreatePlatform}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
