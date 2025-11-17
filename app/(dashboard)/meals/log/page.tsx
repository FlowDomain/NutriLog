"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FoodSelector } from "@/components/FoodSelector";
import { MacroDisplay } from "@/components/MacroDisplay";
import { GradeIndicator } from "@/components/GradeIndicator";
import { useMeals } from "@/hooks/useMeals";
import { format } from "date-fns";
import { toast } from "@/lib/toast";

const mealFormSchema = z.object({
    name: z.string().min(1, "Meal name is required"),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    date: z.string(),
    notes: z.string().optional(),
});

type MealFormValues = z.infer<typeof mealFormSchema>;

interface SelectedFood {
    foodId: string;
    foodName: string;
    servingSize: number;
    quantity: number;
    calories: number;
    macros: {
        carbs: number;
        protein: number;
        fats: number;
    };
}

export default function LogMealPage() {
    const router = useRouter();
    const { createMeal } = useMeals();
    const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<MealFormValues>({
        resolver: zodResolver(mealFormSchema),
        defaultValues: {
            name: "",
            mealType: "breakfast",
            date: format(new Date(), "yyyy-MM-dd"),
            notes: "",
        },
    });

    // Calculate totals
    const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0);
    const totalMacros = selectedFoods.reduce(
        (acc, food) => ({
            carbs: acc.carbs + food.macros.carbs,
            protein: acc.protein + food.macros.protein,
            fats: acc.fats + food.macros.fats,
        }),
        { carbs: 0, protein: 0, fats: 0 }
    );

    const handleSubmit = async (values: MealFormValues) => {
        if (selectedFoods.length === 0) {
            toast.warning("No foods selected", "Please add at least one food item to your meal");
            return;
        }

        setIsLoading(true);

        try {
            const mealData = {
                ...values,
                foods: selectedFoods.map((food) => ({
                    foodId: food.foodId,
                    quantity: food.quantity,
                })),
            };

            const result = await createMeal(mealData);

            toast.success(
                "Meal logged successfully!",
                `Grade: ${result.gradeResult?.grade || 'N/A'} • ${totalCalories} calories`
            );

            // Show success and redirect after 2 seconds
            setTimeout(() => {
                router.push("/meals");
            }, 2000);
        } catch (err: any) {
            toast.error("Failed to log meal", err.message || "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Log Meal</h2>
                <p className="text-muted-foreground">
                    Add a new meal to track your nutrition
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Meal Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meal Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Breakfast, Lunch" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="mealType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Meal Type *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="breakfast">Breakfast</SelectItem>
                                                            <SelectItem value="lunch">Lunch</SelectItem>
                                                            <SelectItem value="dinner">Dinner</SelectItem>
                                                            <SelectItem value="snack">Snack</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date *</FormLabel>
                                                    <FormControl>
                                                        <Input type="date" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Any additional notes about this meal..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Select Foods</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FoodSelector
                                selectedFoods={selectedFoods}
                                onFoodsChange={setSelectedFoods}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Meal Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Calories</p>
                                <p className="text-3xl font-bold">{totalCalories} kcal</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Total Items</p>
                                <p className="text-xl font-semibold">{selectedFoods.length}</p>
                            </div>

                            {selectedFoods.length > 0 && (
                                <>
                                    <div>
                                        <p className="text-sm font-medium mb-3">Macro Breakdown</p>
                                        <MacroDisplay macros={totalMacros} calories={totalCalories} />
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            type="button"
                                            className="w-full"
                                            onClick={form.handleSubmit(handleSubmit)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Logging Meal..." : "Log Meal"}
                                        </Button>
                                    </div>
                                </>
                            )}

                            {selectedFoods.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    Add foods to see summary
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}