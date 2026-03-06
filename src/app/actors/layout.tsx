import React from "react";
import Header from "@/shared/ui/Header";
import Footer from "@/shared/ui/Footer";

export default function ActorsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const routes = [
        { name: "Home", path: "/" },
        { name: "Actors", path: "/actors" },
        { name: "Movies", path: "/movies" },
        { name: "Create Actor", path: "/crear" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header routes={routes} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}{""}
                {/* The current page will be rendered here (e.g., actors/page.tsx). */}
            </main>
            <Footer />
        </div>
    );
} 