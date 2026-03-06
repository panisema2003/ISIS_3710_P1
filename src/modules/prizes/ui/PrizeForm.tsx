"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrizeFormData, PrizeSchema } from "@/modules/prizes/validation/prize.schema";

interface PrizeFormProps {
    onSubmit: SubmitHandler<PrizeFormData>;
    defaultValues?: Partial<PrizeFormData>;
    isSubmitting?: boolean;
}

export default function PrizeForm({
    onSubmit,
    defaultValues,
    isSubmitting,
}: PrizeFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<PrizeFormData>({
        resolver: zodResolver(PrizeSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            status: "nominated",
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                    Prize Name
                </label>
                <input
                    id="name"
                    {...register("name")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Best Picture, Best Director"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-800 mb-1">
                    Category
                </label>
                <input
                    id="category"
                    {...register("category")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Oscar, Golden Globe, BAFTA"
                />
                {errors.category && (
                    <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-800 mb-1">
                    Year
                </label>
                <input
                    id="year"
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={1900}
                    max={2100}
                />
                {errors.year && (
                    <p className="text-red-600 text-sm mt-1">{errors.year.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-800 mb-1">
                    Status
                </label>
                <select
                    id="status"
                    {...register("status")}
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="nominated">Nominated</option>
                    <option value="won">Won</option>
                </select>
                {errors.status && (
                    <p className="text-red-600 text-sm mt-1">{errors.status.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black font-bold py-2 px-6 rounded hover:bg-yellow-500 disabled:bg-gray-300"
            >
                {isSubmitting ? "Saving..." : "Save Prize"}
            </button>
        </form>
    );
}
