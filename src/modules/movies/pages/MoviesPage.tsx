"use client";

import { useState } from "react";
import { useMovies } from "@/modules/movies/hooks/useMovies";
import { Movie } from "@/modules/movies/types/movie.type";
import Modal from "@/shared/ui/Modal";

export default function MoviesPage() {
    const { movies, isLoading, error } = useMovies();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
    }

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-5">List of Movies</h1> 
            <ul className="space-y-4">
                {movies.map((movie) => (
                    <li
                        key={movie.id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleMovieClick(movie)}
                    >
                        <h2 className="text-xl font-semibold">{movie.title}</h2>
                        <p className="text-gray-600 mt-2">{movie.popularity}</p>
                    </li>
                ))}
            </ul>
            <Modal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedMovie ? selectedMovie.title : "Movie Details"}
            >
                {/* Modal content */}
                <p>{selectedMovie?.popularity}</p>
                <p className="mt-4 text-sm text-gray-500">
                    Movie ID: {selectedMovie?.id}
                </p>
                <p>Actors: {selectedMovie?.actors?.join(", ")}</p>
            </Modal>
        </div>
    );
}