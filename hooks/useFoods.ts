"use client";

import { useState, useEffect } from "react";

// ✅ Updated Food interface with source and system food properties
export interface Food {
    _id: string;
    userId?: string; // Optional because system foods don't have userId
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
    isPublic?: boolean;
    createdAt: string;
    updatedAt: string;

    // ✅ New properties for system foods
    source?: 'user' | 'system' | 'public'; // Where this food comes from
    isSystemFood?: boolean; // Flag for system foods
    isEditable?: boolean; // Can user edit this food
    isDeletable?: boolean; // Can user delete this food
    usageCount?: number; // For system foods - track popularity
}

// ✅ Updated fetch params to include includeSystem
interface FetchFoodsParams {
    search?: string;
    category?: string;
    includePublic?: boolean;
    includeSystem?: boolean; // ✅ New parameter
    limit?: number;
}

export function useFoods() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFoods = async (params?: FetchFoodsParams) => {
        setIsLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();

            if (params?.search) {
                queryParams.append("search", params.search);
            }
            if (params?.category) {
                queryParams.append("category", params.category);
            }
            if (params?.includePublic) {
                queryParams.append("includePublic", "true");
            }
            // ✅ Include system foods parameter (default true)
            if (params?.includeSystem !== undefined) {
                queryParams.append("includeSystem", params.includeSystem.toString());
            }
            if (params?.limit) {
                queryParams.append("limit", params.limit.toString());
            }

            const response = await fetch(`/api/foods?${queryParams.toString()}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setFoods(result.data);
        } catch (err: any) {
            console.error('[useFoods] Fetch error:', err);
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

            // Refetch to update the list
            await fetchFoods({ includePublic: true, includeSystem: true });
            return result.data;
        } catch (err: any) {
            console.error('[useFoods] Create error:', err);
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

            // Refetch to update the list
            await fetchFoods({ includePublic: true, includeSystem: true });
            return result.data;
        } catch (err: any) {
            console.error('[useFoods] Update error:', err);
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

            // Refetch to update the list
            await fetchFoods({ includePublic: true, includeSystem: true });
        } catch (err: any) {
            console.error('[useFoods] Delete error:', err);
            throw new Error(err.message);
        }
    };

    // ✅ Initial fetch includes all food sources
    useEffect(() => {
        fetchFoods({ includePublic: true, includeSystem: true });
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