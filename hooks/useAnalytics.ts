"use client"

import { useEffect, useState } from "react";

export interface AnalyticsData {
    summary: {
        totalMeals: number;
        totalCalories: number;
        averageCaloriesPerDay: number;
        totalMacros: {
            carbs: number;
            protein: number;
            fats: number;
        };
        averageGradeScore: number;
        currentStreak: number;
        longestStreak: number;
    };
    gradeDistribution: {
        A: number;
        B: number;
        C: number;
        D: number;
    };
    mealTypeDistribution: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snack: number;
    }
    dailyBreakdown: Array<{
        date: string;
        calories: number;
        macros: {
            carbs: number;
            protein: number;
            fats: number;
        };
        meals: number;
        averageGrade: number
    }>;
    bestMeals: Array<{
        id: string;
        name: string;
        date: string;
        grade: string;
        gradeScore: number;
        calories: number;
    }>
    worstMeals: Array<{
        id: string;
        name: string;
        date: string;
        grade: string;
        gradeScore: number;
        calories: number;
    }>
    period: {
        startDate: string
        endDate: string
        days: number
    }
}

export function useAnalytics(period: "week" | "month" | "all" = "week") {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchAnalytics = async (selectedPeriod?: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const periodParam = selectedPeriod || period
            const response = await fetch(`/api/analytics?period=${periodParam}`)
            const result = await response.json()

            if (!result.success) {
                throw new Error(result.error)
            }
            setData(result.data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
    }, [period])

    return {
        data, isLoading, error, refetch: fetchAnalytics,
    }
}