"use client";

import { useState, useEffect } from "react";

export interface Meal {
    _id: string;
    userId: string;
    name: string;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    date: string;
    foods: Array<{
        foodId: string;
        foodName: string;
        quantity: number;
        calories: number;
        macros: {
            carbs: number;
            protein: number;
            fats: number;
        };
    }>;
    totalCalories: number;
    totalMacros: {
        carbs: number;
        protein: number;
        fats: number;
    };
    grade: "A" | "B" | "C" | "D";
    gradeScore: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export function useMeals(date?: string) {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMeals = async (params?: { date?: string; startDate?: string; endDate?: string }) => {
        setIsLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (params?.date) queryParams.append("date", params.date);
            if (params?.startDate) queryParams.append("startDate", params.startDate);
            if (params?.endDate) queryParams.append("endDate", params.endDate);

            const response = await fetch(`/api/meals?${queryParams.toString()}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setMeals(result.data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const createMeal = async (data: any) => {
        try {
            const response = await fetch("/api/meals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchMeals(date ? { date } : undefined);
            return result.data;
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    const deleteMeal = async (id: string) => {
        try {
            const response = await fetch(`/api/meals/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            await fetchMeals(date ? { date } : undefined);
        } catch (err: any) {
            throw new Error(err.message);
        }
    };

    useEffect(() => {
        fetchMeals(date ? { date } : undefined);
    }, [date]);

    return {
        meals,
        isLoading,
        error,
        fetchMeals,
        createMeal,
        deleteMeal,
    };
}