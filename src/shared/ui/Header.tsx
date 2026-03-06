import React from "react";
import Link from "next/link";
import Image from "next/image";

interface Route {
    name: string;
    path: string;
}

const Header = ({ routes }: { routes: Route[] }) => {
    return (
        <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-2xl font-bold">
                    <Image
                        src="/logo_pexels.jpg"
                        alt="Logo de Cinema"
                        width={40}
                        height={40}
                    />
                    <span className="text-2xl font-semibold">Movies & Movies</span>
                </Link>    
                <nav>
                    {routes.map((route) => (
                        <Link
                            key={route.path}
                            href={route.path}
                            className="px-4 hover:text-gray-300"
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