"use client";

import { useState, useEffect } from "react";

export interface Food {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    servingSize: number;
    calories: number;
    macros: {
        carbs: number;
        protein: number;
        fats: number;
    };
    category?: string;
    tags?: string[];
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export function useFoods() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFoods = async (params?: {
        search?: string;
        category?: string;
        includePublic?: boolean;
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (params?.search) queryParams.append("search", params.search);
            if (params?.category) queryParams.append("category", params.category);
            if (params?.includePublic) queryParams.append("includePublic", "true");

            const response = await fetch(`/api/foods?${queryParams.toString()}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setFoods(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createFood = async (data: any) => {
        try {
            const response = await fetch("/api/foods", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchFoods();
            return result.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const updateFood = async (id: string, data: any) => {
        try {
            const response = await fetch(`/api/foods/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchFoods();
            return result.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const deleteFood = async (id: string) => {
        try {
            const response = await fetch(`/api/foods/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchFoods();
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return {
        foods,
        isLoading,
        error,
        fetchFoods,
        createFood,
        updateFood,
        deleteFood,
    };
}