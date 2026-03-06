import React from "react";


export default function PlatformsLayout({
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
