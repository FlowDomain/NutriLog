// app/foods/[id]/page.tsx (or wherever your edit page is)
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodForm } from "@/components/FoodForm";
import { toast } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditFoodPage() {
    const router = useRouter();
    const params = useParams();
    const foodId = params.id as string;

    const [food, setFood] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchFood();
    }, [foodId]);

    const fetchFood = async () => {
        try {
            const response = await fetch(`/api/foods/${foodId}`);
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            setFood(result.data);
            
            // ✅ Check if food is editable
            if (result.data.source === 'system' || result.data.isEditable === false) {
                toast.error(
                    "Cannot edit this food", 
                    "This food is from the Indian database and cannot be modified"
                );
                // Redirect back to foods page after 2 seconds
                setTimeout(() => {
                    router.push("/foods");
                }, 2000);
            }
        } catch (err: any) {
            toast.error("Failed to load food", err.message);
            setTimeout(() => {
                router.push("/foods");
            }, 2000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSaving(true);

        try {
            const response = await fetch(`/api/foods/${foodId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success("Food updated successfully!", `${data.name} has been updated`);
            
            setTimeout(() => {
                router.push("/foods");
                router.refresh();
            }, 1000);
        } catch (err: any) {
            toast.error("Failed to update food", err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <FormSkeleton fields={6} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // ✅ Block editing system foods
    if (food && (food.source === 'system' || food.isEditable === false)) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Cannot Edit Food</h2>
                    <p className="text-muted-foreground">This food cannot be modified</p>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-medium">
                                This food is from the NutriLog Food Database and cannot be edited.
                            </p>
                            <p className="text-sm">
                                If you want to customize it, you can create a new custom food with your own values.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <CardTitle>{food.name}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Serving Size</p>
                                <p className="text-lg font-semibold">{food.servingSize}g</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Calories</p>
                                <p className="text-lg font-semibold">{food.calories} kcal</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-2">Macros</p>
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 rounded bg-blue-100">
                                    <p className="text-xs">Carbs</p>
                                    <p className="font-semibold">{food.macros.carbs}g</p>
                                </div>
                                <div className="text-center p-2 rounded bg-green-100">
                                    <p className="text-xs">Protein</p>
                                    <p className="font-semibold">{food.macros.protein}g</p>
                                </div>
                                <div className="text-center p-2 rounded bg-yellow-100">
                                    <p className="text-xs">Fats</p>
                                    <p className="font-semibold">{food.macros.fats}g</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button onClick={() => router.push("/foods")}>
                                Back to Foods
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => router.push("/foods/add")}
                            >
                                Create Custom Food
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Not found
    if (!food) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        Food not found. Redirecting...
                    </p>
                </div>
            </div>
        );
    }

    // ✅ Normal edit page for user's own foods
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Food</h2>
                <p className="text-muted-foreground">Update food item details</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Food Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <FoodForm
                        initialData={food}
                        onSubmit={handleSubmit}
                        onCancel={() => router.push("/foods")}
                        isLoading={isSaving}
                    />
                </CardContent>
            </Card>
        </div>
    );
}