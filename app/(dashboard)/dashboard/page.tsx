"use client"

import { MacroDisplay } from "@/components/MacroDisplay";
import { MealCard } from "@/components/MealCard";
import { ProgressRing } from "@/components/ProgressRing";
import { DashboardSkeleton } from "@/components/skeletons/PageSkeletons";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useMeals } from "@/hooks/useMeals";
import { format } from "date-fns";
import { Award, Calendar, Flame, Plus, Target, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {

    const router = useRouter()
    const today = format(new Date(), "yyyy-MM-dd")
    const { meals, isLoading: mealsLoading } = useMeals(today)
    const { data: analytics, isLoading: analyticsLoading } = useAnalytics("week")

    // Today's totals
    const todayCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0)
    const todayMacros = meals.reduce(
        (acc, meal) => ({
            carbs: acc.carbs + meal.totalMacros.carbs,
            protein: acc.protein + meal.totalMacros.protein,
            fats: acc.fats + meal.totalMacros.fats,
        }), { carbs: 0, protein: 0, fats: 0 }
    )

    const calorieTarget = 2000 // TODO: get from user profile

    const calorieProgress = Math.min(100, Math.round((todayCalories / calorieTarget) * 100))
    const averageGradeToday = meals.length > 0 ? Math.round(meals.reduce((sum, meal) => sum + meal.gradeScore, 0) / meals.length) : 0
    const getGradeColor = (score: number) => {
        if (score >= 85) return "#10b981";
        if (score >= 70) return "#3b82f6";
        if (score >= 50) return "#f59e0b";
        return "#ef4444";
    }

    if (mealsLoading || analyticsLoading) {
        return (
            <DashboardSkeleton/>
        );
    }

    return (
        <div className="space-y-6 pr-5 pl-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-[#932152]">Dashboard</h2>
                    <p className="text-muted-foreground">
                        {format(new Date(), "EEEE, MMMM d, yyyy")}
                    </p>
                </div>
                <Button onClick={() => router.push("/meals/log")} className="bg-[#932152]">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Meal
                </Button>
            </div>

            {/* Today's Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Today&apos;s Calories</p>
                                <p className="text-2xl font-bold">
                                    {todayCalories} <span className="text-sm text-muted-foreground">/ {calorieTarget}</span>
                                </p>
                            </div>
                            <ProgressRing progress={calorieProgress} size={80} strokeWidth={6} color="#3b82f6" />
                        </div>
                    </CardContent>
                </Card>

                <StatCard title="Meals Today" value={meals.length} subtitle={`${meals.filter((m) => m.mealType === "breakfast").length} Breakfast, ${meals.filter((m) => m.mealType === "lunch").length} Lunch, ${meals.filter((m) => m.mealType === "dinner").length} Dinner `} icon={Calendar} />

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Grade Today</p>
                                <p className="text-2xl font-bold">{averageGradeToday}</p>
                            </div>
                            <ProgressRing progress={averageGradeToday} size={80} strokeWidth={6} color={getGradeColor(averageGradeToday)} />
                        </div>
                    </CardContent>
                </Card>
                <StatCard title="Current Streak" value={`${analytics?.summary.currentStreak || 0} days`} subtitle={`Longest ${analytics?.summary.longestStreak || 0} days`} icon={TrendingUp} />
            </div>

            {/* Today's Macros */}
            {meals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Today&apos;s Macros Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MacroDisplay macros={todayMacros} calories={todayCalories} />
                    </CardContent>
                </Card>
            )}

            {/* Weekly Stats */}
            {analytics && (
                <div className="grid gap-4 md:grid-cols-3">
                    <StatCard title="Weekly Average" value={`${analytics.summary.averageCaloriesPerDay} cal`} subtitle="Per day" icon={Flame} />
                    <StatCard title="Total Meals" value={analytics.summary.totalMeals} subtitle="This Week" icon={Target} />
                    <StatCard title="Average Grade" value={analytics.summary.averageGradeScore} subtitle="This Week" icon={Award} />
                </div>
            )}

            {/* Today's Meals */}
            <div>
                <div className="flex items-center justify-between mb-4 ">
                    <h3 className="text-xl font-semibold">Today&apos;s Meals</h3>
                    <Button variant="outline" onClick={() => router.push("/meals")}>
                        View All
                    </Button>
                </div>
                {meals.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground mb-4">No meals logged today</p>
                            <Button onClick={() => router.push("/meals/log")} className="bg-[#932152]">
                                <Plus className="mr-2 h-4 w-4" />
                                Log Your First Meal
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {meals.map((meal) => (
                            <MealCard key={meal._id} meal={meal} showActions={false} />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                    <Button onClick={() => router.push("/meals/log")} className="h-auto py-4">
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="h-6 w-6" />
                            <span>Log Meal</span>
                        </div>
                    </Button>
                    <Button onClick={() => router.push("/foods/add")} variant="outline" className="h-auto py-4">
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="h-6 w-6" />
                            <span>Add Food</span>
                        </div>
                    </Button>
                    <Button onClick={() => router.push("/analytics")} variant="outline" className="h-auto py-4">
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="h-6 w-6" />
                            <span>View Analytics</span>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
