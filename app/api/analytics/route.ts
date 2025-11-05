import { Meal } from "@/database/models/meal";
import { connectToDatabase } from "@/database/mongoose";
import { requireAuth } from "@/lib/auth/session";
import { endOfDay, format, startOfDay, subDays } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth()
        await connectToDatabase()

        const { searchParams } = new URL(request.url)
        const period = searchParams.get("period") || "week"
        const date = searchParams.get("date")

        let startDate = new Date()
        const endDate = new Date()

        // Date Range
        if (date) {
            startDate = startOfDay(new Date(date))
            endDate.setTime(endOfDay(new Date(date)).getTime())
        } else if (period === "week") {
            startDate = subDays(endDate, 7)
        } else if (period === "month") {
            startDate = subDays(endDate, 30)
        } else {
            // All time
            const firstMeal = await Meal.findOne({ userId: session.user.id }).sort({ date: 1 }).lean()
            startDate = firstMeal ? new Date(firstMeal.date) : subDays(endDate, 30)
        }


        // Fetch meals in date range
        const meals = await Meal.find({
            userId: session.user.id,
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        }).sort({ date: 1 }).lean()


        // Calculate Overall stats
        const totalMeals = meals.length
        const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0)
        const averageCaloriesPerDay = totalMeals > 0 ? Math.round(totalCalories / Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))) : 0

        const totalMacros = meals.reduce((acc, meal) => ({
            carbs: acc.carbs + meal.totalMacros.carbs,
            protein: acc.protein + meal.totalMacros.protein,
            fats: acc.fats + meal.totalMacros.fats,
        }), { carbs: 0, protein: 0, fats: 0 })


        // Grade Stats
        const gradeCount = {
            A: meals.filter((m) => m.grade === "A").length,
            B: meals.filter((m) => m.grade === "B").length,
            C: meals.filter((m) => m.grade === "C").length,
            D: meals.filter((m) => m.grade === "D").length,
        }


        const averageGradeScore = totalMeals > 0 ? Math.round(meals.reduce((sum, meal) => sum + meal.gradeScore, 0) / totalMeals) : 0

        // Daily Breakdown
        const dailyData: {
            [key: string]: {
                date: string
                calories: number
                macros: { carbs: number, protein: number, fats: number }
                meals: number
                averageGrade: number
            }
        } = {}

        meals.forEach((meal) => {
            const dateKey = format(new Date(meal.date), "yyyy-MM-dd")
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    date: dateKey,
                    calories: 0,
                    macros: { carbs: 0, protein: 0, fats: 0 },
                    meals: 0,
                    averageGrade: 0,
                }
            }
            dailyData[dateKey].calories += meal.totalCalories;
            dailyData[dateKey].macros.carbs += meal.totalMacros.carbs;
            dailyData[dateKey].macros.protein += meal.totalMacros.protein;
            dailyData[dateKey].macros.fats += meal.totalMacros.fats;
            dailyData[dateKey].meals += 1;
            dailyData[dateKey].averageGrade += meal.gradeScore;
        })

        // Calculate average grades per day
        Object.keys(dailyData).forEach((dateKey) => {
            dailyData[dateKey].averageGrade = Math.round(dailyData[dateKey].averageGrade / dailyData[dateKey].meals)
        })

        const dailyBreakdown = Object.values(dailyData)

        // Meal type distribution
        const mealTypeDistribution = {
            breakfast: meals.filter((m) => m.mealType === "breakfast").length,
            lunch: meals.filter((m) => m.mealType === "lunch").length,
            dinner: meals.filter((m) => m.mealType === "dinner").length,
            snack: meals.filter((m) => m.mealType === "snack").length,
        }


        // Best and Worst meals
        const sortedByGrade = [...meals].sort((a, b) => b.gradeScore - a.gradeScore)
        const bestMeals = sortedByGrade.slice(0, 5)
        const worstMeals = sortedByGrade.slice(-5).reverse()

        // Streak Calculation
        let currentStreak = 0
        let longestStreak = 0
        let tempStreak = 0
        const today = format(new Date(), "yyyy-MM-dd")

        // Get unique dates with meals
        const datesWithMeals = new Set(
            meals.map((m) => format(new Date(m.date), "yyyy-MM-dd"))
        )

        // Calculate current streak
        let checkDate = new Date()
        while (datesWithMeals.has(format(checkDate, "yyyy-MM-dd"))) {
            currentStreak++
            checkDate = subDays(checkDate, 1)
        }

        // Calculate longest streak 
        const sortedDates = Array.from(datesWithMeals).sort()
        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                tempStreak = 1
            } else {
                const prevDate = new Date(sortedDates[i - 1])
                const currDate = new Date(sortedDates[i])
                const diffDays = Math.round(
                    (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
                )
                if (diffDays === 1) {
                    tempStreak++
                } else {
                    longestStreak = Math.max(longestStreak, tempStreak)
                    tempStreak = 1
                }
            }
        }
        longestStreak = Math.max(longestStreak, tempStreak)

        return NextResponse.json({
            success: true,
            data: {
                summary: {
                    totalMeals,
                    totalCalories,
                    averageCaloriesPerDay,
                    totalMacros,
                    averageGradeScore,
                    currentStreak,
                    longestStreak,
                },
                gradeDistribution: gradeCount,
                mealTypeDistribution,
                dailyBreakdown,
                bestMeals: bestMeals.map((m) => ({
                    id: m._id,
                    name: m.name,
                    date: m.date,
                    grade: m.grade,
                    gradeScore: m.gradeScore,
                    calories: m.totalCalories,
                })),
                worstMeals: worstMeals.map((m) => ({
                    id: m._id,
                    name: m.name,
                    date: m.date,
                    grade: m.grade,
                    gradeScore: m.gradeScore,
                    calories: m.totalCalories,
                })),
                period: {
                    startDate: format(startDate, "yyyy-MM-dd"),
                    endDate: format(endDate, "yyyy-MM-dd"),
                    days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
                },
            },
        });

    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            )
        }
        console.error("Analytics error:", error)
        return NextResponse.json(
            { success: false, error: "Failed to fetch analytics" },
            { status: 500 }
        )

    }
}