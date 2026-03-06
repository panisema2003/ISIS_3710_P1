import React from "react";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";

export default function ReviewsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow bg-gray-100">
                {children}
            </main>
        </div>
    );
}
