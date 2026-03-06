import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Route {
    name: string;
    path: string;
}

const Header = ({ routes }: { routes: Route[] }) => {
    return (
        <header className="bg-gray-800 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Logo and brand */}
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <Image
                        src="/logo_pexels.jpg"
                        alt="Logo de Cinema"
                        width={44}
                        height={44}
                        className="rounded-lg"
                    />
                    <span className="text-xl font-bold tracking-wide">Movies & Movies</span>
                </Link>
                
                {/* Navigation */}
                <nav className="flex items-center gap-1">
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            href={route.path}
                            className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            {route.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;