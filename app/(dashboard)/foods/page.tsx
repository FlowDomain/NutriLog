"use client";

import { useState } from "react";
import { useFoods } from "@/hooks/useFoods";
import { FoodCard } from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { toast } from "@/lib/toast";
import { FoodsListSkeleton } from "@/components/skeletons/PageSkeletons";

export default function FoodsPage() {
    const router = useRouter();
    const { foods, isLoading, deleteFood, fetchFoods } = useFoods();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleSearch = (value: string) => {
        setSearch(value);
        fetchFoods({ search: value });
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteFood(deleteId);
                setDeleteId(null);
                toast.success('Food deleted', 'The food has been removed')
            } catch (error) {
                console.error("Delete failed:", error);
            }
        }
    };

    const filteredFoods = foods.filter((food) =>
        food.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 pr-5 pl-5">
            <div className="flex items-center justify-between ">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-brand">Foods</h2>
                    <p className="text-muted-foreground">
                        Manage your food items.
                    </p>
                </div>
                <Button className="bg-brand hover:bg-brand-100" onClick={() => router.push("/foods/add")}>
                    <Plus className="h-4 w-4" />
                    Add Food
                </Button>
            </div>

            <div className="flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search foods..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {isLoading ? (
                <FoodsListSkeleton/>
            ) : filteredFoods.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">
                        {search ? "No foods found" : "No foods yet. Add your first food!"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredFoods.map((food) => (
                        <FoodCard
                            key={food._id}
                            food={food}
                            onEdit={(id) => router.push(`/foods/${id}`)}
                            onDelete={(id) => setDeleteId(id)}
                        />
                    ))}
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Food</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this food? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-700" onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}