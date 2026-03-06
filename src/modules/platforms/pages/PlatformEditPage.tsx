"use client";

import { useState, useEffect } from "react";
import PlatformForm from "../ui/PlatformForm";
import { PlatformFormData } from "../validation/platform.schema";
import { useRouter } from "next/navigation";
import { fetchPlatformById, updatePlatform } from "../services/platform.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

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
                setError(err instanceof Error ? err.message : "Failed to load platform");
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
            showNotification("Platform updated successfully!", "success");
            router.push("/platforms");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while updating the platform.");
            showNotification("Failed to update platform.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container mx-auto p-8">
                <p>Loading platform...</p>
            </main>
        );
    }

    if (error && !defaultValues) {
        return (
            <main className="container mx-auto p-8">
                <p className="text-red-500">Error: {error}</p>
            </main>
        );
    }

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Edit Platform</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <PlatformForm
                onSubmit={handleUpdatePlatform}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
