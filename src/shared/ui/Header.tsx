import Link from "next/link";
import Image from "next/image";

interface SubRoute {
    name: string;
    path: string;
}

interface NavItem {
    name: string;
    path: string;
    subItems?: SubRoute[];
}

const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    { 
        name: "Movies", 
        path: "/movies",
        subItems: [
            { name: "All Movies", path: "/movies" },
            { name: "Add Movie", path: "/movies/new" },
            { name: "YouTube Trailers", path: "/youtube-trailers" },
        ]
    },
    { 
        name: "People", 
        path: "/actors",
        subItems: [
            { name: "Actors", path: "/actors" },
            { name: "Directors", path: "/directors" },
        ]
    },
    { 
        name: "Categories", 
        path: "/genres",
        subItems: [
            { name: "Genres", path: "/genres" },
            { name: "Platforms", path: "/platforms" },
        ]
    },
];

const Header = () => {
    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <Image
                        src="/new_logo_pexels.jpg"
                        alt="Logo de Cinema"
                        width={44}
                        height={44}
                        className="rounded-lg"
                    />
                    <span className="text-xl font-bold tracking-wide">Movies & Movies</span>
                </Link>
                
                {/* Navv */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => (
                        <div key={item.path} className="relative group">
                            <Link
                                href={item.path}
                                className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-1"
                            >
                                {item.name}
                                {item.subItems && (
                                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>
                            
                            {/* Dropdown menu (this way its cleaner and smooother) */}
                            {item.subItems && (
                                <div className="absolute left-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="py-2">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                href={subItem.path}
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </header>
    );
};

export default Header;