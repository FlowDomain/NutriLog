"use client"

import { CalorieChart } from "@/components/CalorieChart";
import { GradeDistribution } from "@/components/GradeDistribution";
import { MacroChart } from "@/components/MacroChart";
import { MealTypeChart } from "@/components/MealTypeChart";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnalytics } from "@/hooks/useAnalytics";
import { format } from "date-fns";
import { Award, Calendar, Flame, TrendingUp, Trophy } from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<"week" | "month" | "all">("week")
    const { data, isLoading, refetch } = useAnalytics(period)

    const handlePeriodChange = (newPeriod: string) => {
        setPeriod(newPeriod as "week" | "month" | "all")
        refetch(newPeriod)
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight" >Analytics</h2>
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading analytics...</p>
                </div>
            </div>
        )
    }


    if (!data) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight" >Analytics</h2>
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">No data available yet. Start logging meals!</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6 pr-5 pl-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
                    <p className="text-muted-foreground">
                        {format(new Date(data.period.startDate), "MMM d")}-{" "}
                        {format(new Date(data.period.endDate), "MMM d, yyyy")}
                    </p>
                </div>
                <Select value={period} onValueChange={handlePeriodChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="week" >Last 7 Days</SelectItem>
                        <SelectItem value="month" >Last 30 Days</SelectItem>
                        <SelectItem value="all" >All Time</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Total Calories" value={data.summary.totalCalories.toLocaleString()} subtitle={`${data.summary.averageCaloriesPerDay} cal/day`} icon={Flame} />

                <StatCard title="Total Meals" value={data.summary.totalMeals} subtitle={`${Math.round(data.summary.totalMeals / data.period.days)} meals/day`} icon={Calendar} />

                <StatCard title="Average Grade" value={data.summary.averageGradeScore} subtitle="Overall Score" icon={Award} />

                <StatCard title="Current Streak" value={`${data.summary.currentStreak} days`} subtitle={`Longest: ${data.summary.longestStreak} days`} icon={TrendingUp} />
            </div>

            {/* Calorie Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Calorie Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <CalorieChart data={data.dailyBreakdown} target={2000} />
                </CardContent>
            </Card>

            {/* Charts Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Macro Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Total Macro Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MacroChart macros={data.summary.totalMacros} />
                        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Carbs</p>
                                <p className="text-lg font-bold">{Math.round(data.summary.totalMacros.carbs)}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Protein</p>
                                <p className="text-lg font-bold">{Math.round(data.summary.totalMacros.protein)}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Fats</p>
                                <p className="text-lg font-bold">{Math.round(data.summary.totalMacros.fats)}g</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                {/* Grade Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GradeDistribution distribution={data.gradeDistribution} />
                    </CardContent>
                </Card>

                {/* Meal Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle>Meal Type Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <MealTypeChart distribution={data.mealTypeDistribution} />
                    </CardContent>
                </Card>

                {/* Streak Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Current Streak</span>
                                <Badge variant="default">{data.summary.currentStreak} days</Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Longest Streak</span>
                                <Badge variant="default">{data.summary.longestStreak} days</Badge>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <p className="text-sm text-muted-foreground mb-2">Grade Breakdown</p>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>A Grades</span>
                                    <span className="font-semibold text-green-600">{data.gradeDistribution.A}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>B Grades</span>
                                    <span className="font-semibold text-blue-600">{data.gradeDistribution.B}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>C Grades</span>
                                    <span className="font-semibold text-orange-600">{data.gradeDistribution.C}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>D Grades</span>
                                    <span className="font-semibold text-red-600">{data.gradeDistribution.D}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Best and Worst Meals */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Best Meals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600">🏆 Top Rated Meals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.bestMeals.slice(0, 5).map((meal, index) => (
                                <div key={meal.id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium">{meal.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {format(new Date(meal.date), "MMM d")} • {meal.calories} cal
                                        </p>
                                    </div>
                                    <Badge className={meal.grade === "A" ? "bg-green-500" : meal.grade === "B" ? "bg-blue-500" : "bg-orange-500"}>
                                        Grade {meal.grade}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>


                {/* Worst Meals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-orange-600">📉 Needs Improvement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.worstMeals.slice(0, 5).map((meal, index) => (
                                <div key={meal.id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium">{meal.name}</p>
                                        <p className="text-muted-foreground text-sm">
                                            {format(new Date(meal.date), "MMM d")} • {meal.calories} cal
                                        </p>
                                    </div>
                                    <Badge className={meal.grade === "C" ? "bg-orange-500" : "bg-red-500"}>
                                        Grade {meal.grade}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}