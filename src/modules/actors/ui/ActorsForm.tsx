"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActorFormData, ActorSchema } from "@/modules/actors/validation/actor.schema";
import { Movie } from "@/modules/movies/types/movie.type";

interface ActorFormProps {
    onSubmit: SubmitHandler<ActorFormData>;
    defaultValues?: ActorFormData;
    isSubmitting?: boolean;
    movies?: Movie[];
    isLoadingMovies?: boolean;
}

export default function ActorForm({
    onSubmit,
    defaultValues,
    isSubmitting,
    movies = [],
    isLoadingMovies = false,
}: ActorFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ActorFormData>({
        resolver: zodResolver(ActorSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block font-medium">
                    Actor Name
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full p-2 border rounded"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="photo" className="block font-medium">
                    Photo URL
                </label>
                <input
                    id="photo"
                    type="url"
                    {...register("photo")}
                    className="w-full p-2 border rounded"
                    placeholder="https://example.com/photo.jpg"
                />
                {errors.photo && (
                    <p className="text-red-500 text-sm mt-1">{errors.photo.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="nationality" className="block font-medium">
                    Nationality
                </label>
                <input
                    id="nationality"
                    {...register("nationality")}
                    className="w-full p-2 border rounded"
                />
                {errors.nationality && (
                    <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="birthDate" className="block font-medium">
                    Birth Date
                </label>
                <input
                    id="birthDate"
                    type="date"
                    {...register("birthDate")}
                    className="w-full p-2 border rounded"
                />
                {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="biography" className="block font-medium">
                    Biography
                </label>
                <textarea
                    id="biography"
                    {...register("biography")}
                    className="w-full p-2 border rounded"
                    rows={4}
                />
                {errors.biography && (
                    <p className="text-red-500 text-sm mt-1">{errors.biography.message}</p>
                )}
            </div>

            <div>
                <label className="block font-medium mb-2">
                    Movies (Optional)
                </label>
                {isLoadingMovies ? (
                    <p className="text-gray-500">Loading movies...</p>
                ) : movies.length === 0 ? (
                    <p className="text-gray-500">No movies available</p>
                ) : (
                    <div className="border rounded p-3 max-h-48 overflow-y-auto space-y-2">
                        {movies.map((movie) => (
                            <div key={movie.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`movie-${movie.id}`}
                                    value={movie.id}
                                    {...register("movieIds")}
                                    className="mr-2"
                                />
                                <label htmlFor={`movie-${movie.id}`} className="text-sm">
                                    {movie.title}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
                {errors.movieIds && (
                    <p className="text-red-500 text-sm mt-1">{errors.movieIds.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? "Saving..." : "Save Actor"}
            </button>
        </form>
    );
}