"use client";

import { useState } from "react";
import { useMeals } from "@/hooks/useMeals";
import { MealCard } from "@/components/MealCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, subDays } from "date-fns";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MealsListSkeleton } from "@/components/skeletons/PageSkeletons";

export default function MealsPage() {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [dateRange, setDateRange] = useState<"today" | "week" | "all">("today");
    const { meals, isLoading, deleteMeal, fetchMeals } = useMeals(
        dateRange === "today" ? selectedDate : undefined
    );
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDateRangeChange = (value: string) => {
        setDateRange(value as "today" | "week" | "all");

        if (value === "today") {
            fetchMeals({ date: selectedDate });
        } else if (value === "week") {
            const endDate = new Date();
            const startDate = subDays(endDate, 7);
            fetchMeals({
                startDate: format(startDate, "yyyy-MM-dd"),
                endDate: format(endDate, "yyyy-MM-dd"),
            });
        } else {
            fetchMeals();
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        if (dateRange === "today") {
            fetchMeals({ date });
        }
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteMeal(deleteId);
                setDeleteId(null);
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    // Calculate daily totals
    const dailyCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const dailyMacros = meals.reduce(
        (acc, meal) => ({
            carbs: acc.carbs + meal.totalMacros.carbs,
            protein: acc.protein + meal.totalMacros.protein,
            fats: acc.fats + meal.totalMacros.fats,
        }),
        { carbs: 0, protein: 0, fats: 0 }
    );

    return (
        <div className="space-y-6 pr-5 pl-5">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-green">Meals</h2>
                    <p className="text-muted-foreground">
                        Track and manage your daily meals
                    </p>
                </div>
                <Button onClick={() => router.push("/meals/log")} className="bg-green">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Meal
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 flex gap-2">
                    <Select value={dateRange} onValueChange={handleDateRangeChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>

                    {dateRange === "today" && (
                        <div className="relative flex-1 max-w-xs">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Summary */}
            {dateRange === "today" && meals.length > 0 && (
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Total Calories</p>
                        <p className="text-2xl font-bold">{dailyCalories} kcal</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="text-2xl font-bold">{Math.round(dailyMacros.carbs)}g</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="text-2xl font-bold">{Math.round(dailyMacros.protein)}g</p>
                    </div>
                    <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">Fats</p>
                        <p className="text-2xl font-bold">{Math.round(dailyMacros.fats)}g</p>
                    </div>
                </div>
            )}

            {/* Meals List */}
            {isLoading ? (
                <MealsListSkeleton/>
            ) : meals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        No meals logged yet. Start tracking your nutrition!
                    </p>
                    <Button onClick={() => router.push("/meals/log")} className="mt-4 bg-green">
                        Log Your First Meal
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {meals.map((meal) => (
                        <MealCard
                            key={meal._id}
                            meal={meal}
                            onDelete={(id) => setDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this meal? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}