"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradeIndicator } from "@/components/GradeIndicator";
import { MacroDisplay } from "./MacroDisplay";
import { Trash2, Clock, Utensils } from "lucide-react";
import { format } from "date-fns";

interface MealCardProps {
    meal: {
        _id: string;
        name: string;
        mealType: "breakfast" | "lunch" | "dinner" | "snack";
        date: string;
        foods: Array<{
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
    };
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export function MealCard({ meal, onDelete, showActions = true }: MealCardProps) {
    const mealTypeColors = {
        breakfast: "bg-orange-100 text-orange-800",
        lunch: "bg-green-100 text-green-800",
        dinner: "bg-blue-100 text-blue-800",
        snack: "bg-purple-100 text-purple-800",
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Utensils className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{meal.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {format(new Date(meal.date), "PPP")}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <GradeIndicator grade={meal.grade} score={meal.gradeScore} showScore />
                        {showActions && onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(meal._id)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                </div>
                <Badge className={mealTypeColors[meal.mealType]}>
                    {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Calories</p>
                        <p className="text-2xl font-bold">{meal.totalCalories} kcal</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Items</p>
                        <p className="text-2xl font-bold">{meal.foods.length}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">Macro Distribution</p>
                    <MacroDisplay macros={meal.totalMacros} calories={meal.totalCalories} />
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">Foods</p>
                    <div className="space-y-1">
                        {meal.foods.map((food, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {food.foodName} ({food.quantity}g)
                                </span>
                                <span className="font-medium">{food.calories} kcal</span>
                            </div>
                        ))}
                    </div>
                </div>

                {meal.notes && (
                    <div>
                        <p className="text-sm font-medium mb-1">Notes</p>
                        <p className="text-sm text-muted-foreground">{meal.notes}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}