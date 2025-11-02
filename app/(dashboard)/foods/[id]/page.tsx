"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { use } from "react";
import { FoodForm } from "@/components/FoodForm";

export default function EditFoodPage() {
    const router = useRouter();
    const params = useParams();
    const foodId = params.id as string;

    const [food, setFood] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSaving(true);
        setError(null);

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

            router.push("/foods");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading food...</p>
                </div>
            </div>
        );
    }

    if (error && !food) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
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

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

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
