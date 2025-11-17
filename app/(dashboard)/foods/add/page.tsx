"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FoodForm } from "@/components/FoodForm";
import { useFoods } from "@/hooks/useFoods";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/lib/toast";

export default function AddFoodPage() {
    const router = useRouter();
    const { createFood } = useFoods();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        setIsLoading(true);

        try {
            await createFood(data);
            toast.success('Food added successfully', 'You can now use this food in your meals')
            router.push("/foods");
        } catch (err: any) {
            toast.error("Failed to add food", err.message || "Please try again");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Add New Food</h2>
                <p className="text-muted-foreground">
                    Add a new food item to your menu.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Food Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <FoodForm
                        onSubmit={handleSubmit}
                        onCancel={() => router.push("/foods")}
                        isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}