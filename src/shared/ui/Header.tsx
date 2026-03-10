"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/shared/i18n/I18nContext";

const Header = () => {
    const { t, locale, setLocale } = useI18n();

    const navItems = [
        { name: t.nav.home, path: "/" },
        { 
            name: t.nav.movies, 
            path: "/movies",
            subItems: [
                { name: t.nav.allMovies, path: "/movies" },
                { name: t.nav.addMovie, path: "/movies/new" },
                { name: t.nav.youtubeTrailers, path: "/youtube-trailers" },
            ]
        },
        { 
            name: t.nav.people, 
            path: "/actors",
            subItems: [
                { name: t.nav.actors, path: "/actors" },
                { name: t.nav.directors, path: "/directors" },
            ]
        },
        { 
            name: t.nav.categories, 
            path: "/genres",
            subItems: [
                { name: t.nav.genres, path: "/genres" },
                { name: t.nav.platforms, path: "/platforms" },
                { name: t.nav.prizes, path: "/prizes" },
            ]
        },
    ];

    return (
        <header className="bg-gray-900 text-white shadow-lg" role="banner">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity" aria-label={t.nav.brand}>
                    <Image
                        src="/new_logo_pexels.jpg"
                        alt="Movies & Movies logo"
                        width={44}
                        height={44}
                        className="rounded-lg"
                    />
                    <span className="text-xl font-bold tracking-wide">{t.nav.brand}</span>
                </Link>
                
                <nav className="flex items-center gap-1" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <div key={item.path + item.name} className="relative group">
                            <Link
                                href={item.path}
                                className="px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center gap-1"
                                aria-haspopup={item.subItems ? "true" : undefined}
                                aria-expanded={item.subItems ? "false" : undefined}
                            >
                                {item.name}
                                {item.subItems && (
                                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </Link>
                            
                            {item.subItems && (
                                <div className="absolute left-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50" role="menu" aria-label={item.name}>
                                    <div className="py-2">
                                        {item.subItems.map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                href={subItem.path}
                                                className="block px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                                                role="menuitem"
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Language Selector */}
                    <div className="ml-4 flex items-center">
                        <label htmlFor="language-select" className="sr-only">{t.language}</label>
                        <select
                            id="language-select"
                            value={locale}
                            onChange={(e) => setLocale(e.target.value as "en" | "es")}
                            className="bg-gray-700 text-white text-sm rounded-lg px-2 py-1 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label={t.language}
                        >
                            <option value="en">EN</option>
                            <option value="es">ES</option>
                        </select>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;