"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FoodForm } from "@/components/FoodForm";
import { toast } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

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
        } catch (err: any) {
            toast.error("Failed to load food", err.message || "Please try again");
            // Optionally redirect back to foods list after error
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

            toast.success(
                "Food updated successfully!",
                `${data.name} has been updated`
            );

            // Redirect after short delay
            setTimeout(() => {
                router.push("/foods");
                router.refresh();
            }, 1000);

        } catch (err: any) {
            toast.error("Failed to update food", err.message || "Please try again");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>

                {/* Form Card Skeleton */}
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

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Edit Food</h2>
                <p className="text-muted-foreground">
                    Update food item details
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Food Details</CardTitle>
                </CardHeader>
                <CardContent>
                    {food && (
                        <FoodForm
                            initialData={food}
                            onSubmit={handleSubmit}
                            onCancel={() => router.push("/foods")}
                            isLoading={isSaving}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
