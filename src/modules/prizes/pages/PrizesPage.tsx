"use client";

import Link from "next/link";
import { usePrizes } from "@/modules/prizes/hooks/usePrizes";

export default function PrizesPage() {
    const { prizes, isLoading, error } = usePrizes();

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Prizes</h1>
                <Link
                    href="/prizes/new"
                    className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500"
                >
                    + New Prize
                </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prizes.map((prize) => (
                    <div
                        key={prize.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <p className="text-xl font-semibold text-gray-900 mb-2">Id: {prize.id}</p>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{prize.name}</h2>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Category:</span> {prize.category}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Year:</span> {prize.year}
                            </p>
                            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                prize.status === "won" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                            }`}>
                                {prize.status === "won" ? "Won" : "Nominated"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {prizes.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600">No prizes found</p>
                </div>
            )}
        </div>
    );
}
