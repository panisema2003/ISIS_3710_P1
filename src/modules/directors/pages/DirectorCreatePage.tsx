"use client";

import { useState } from "react";
import DirectorForm from "../ui/DirectorForm";
import { DirectorFormData } from "../validation/director.schema";
import { useRouter } from "next/navigation";
import { createDirector } from "../services/director.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

export default function DirectorCreatePage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const showNotification = useNotificationStore((state) => state.showNotification);

    const handleCreateDirector = async (data: DirectorFormData) => {
        setIsSubmitting(true);
        try {
            await createDirector(data);
            showNotification("Director created successfully!", "success");
            router.push("/directors");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while creating the director.");
            showNotification("Failed to create director.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Create New Director</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <DirectorForm
                onSubmit={handleCreateDirector}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
