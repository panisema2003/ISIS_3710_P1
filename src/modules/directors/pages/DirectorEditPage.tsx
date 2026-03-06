"use client";

import { useState, useEffect } from "react";
import DirectorForm from "../ui/DirectorForm";
import { DirectorFormData } from "../validation/director.schema";
import { useRouter } from "next/navigation";
import { fetchDirectorById, updateDirector } from "../services/director.service";
import { useNotificationStore } from "@/shared/store/useNotificationStore";

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
                setError(err instanceof Error ? err.message : "Failed to load director");
            } finally {
                setIsLoading(false);
            }
        };
        loadDirector();
    }, [directorId]);

    const handleUpdateDirector = async (data: DirectorFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await updateDirector(directorId, data);
            showNotification("Director updated successfully!", "success");
            router.push("/directors");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred while updating the director.");
            showNotification("Failed to update director.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="container mx-auto p-8">
                <p>Loading director...</p>
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
            <h1 className="text-3xl font-bold mb-6">Edit Director</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <DirectorForm
                onSubmit={handleUpdateDirector}
                defaultValues={defaultValues}
                isSubmitting={isSubmitting}
            />
        </main>
    );
}
