"use client";

import { useState } from "react";
import { useFoods } from "@/hooks/useFoods";
import { FoodCard } from "@/components/FoodCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/lib/toast";
import { FoodsListSkeleton } from "@/components/skeletons/PageSkeletons";

export default function FoodsPage() {
    const router = useRouter();
    const { foods, isLoading, deleteFood, fetchFoods } = useFoods();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showUserFoods, setShowUserFoods] = useState(true);
    const [showSystemFoods, setShowSystemFoods] = useState(true);

    const handleSearch = (value: string) => {
        setSearch(value);
        fetchFoods({ 
            search: value,
            includeSystem: showSystemFoods,
        });
    };

    const handleFilterChange = (userFoods: boolean, systemFoods: boolean) => {
        setShowUserFoods(userFoods);
        setShowSystemFoods(systemFoods);
        fetchFoods({ 
            search,
            includeSystem: systemFoods,
        });
    };

    const handleDelete = async () => {
        if (deleteId) {
            try {
                await deleteFood(deleteId);
                setDeleteId(null);
                toast.success('Food deleted', 'The food has been removed');
            } catch (error) {
                console.error("Delete failed:", error);
                toast.error('Delete failed', 'Could not delete the food');
            }
        }
    };

    // Filter foods based on search and visibility settings
    const filteredFoods = foods.filter((food) => {
        // Apply search filter
        const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase());
        if (!matchesSearch) return false;

        // Apply visibility filter
        if (food.source === 'user' && !showUserFoods) return false;
        if (food.source === 'system' && !showSystemFoods) return false;

        return true;
    });

    // Separate for counts
    const userFoodsCount = foods.filter(f => f.source === 'user').length;
    const systemFoodsCount = foods.filter(f => f.source === 'system').length;

    return (
        <div className="space-y-6 pr-5 pl-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-brand">
                        Foods
                    </h2>
                </div>
                <Button 
                    className="bg-brand hover:bg-brand-100" 
                    onClick={() => router.push("/foods/add")}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Food
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search foods... (e.g., 'aloo paratha', 'dosa')"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Filter Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                            {(!showUserFoods || !showSystemFoods) && (
                                <Badge variant="secondary" className="ml-2">
                                    Active
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Show Foods</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                            checked={showUserFoods}
                            onCheckedChange={(checked) => 
                                handleFilterChange(checked, showSystemFoods)
                            }
                        >
                            My Custom Foods ({userFoodsCount})
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={showSystemFoods}
                            onCheckedChange={(checked) => 
                                handleFilterChange(showUserFoods, checked)
                            }
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            NutriLog Database ({systemFoodsCount})
                        </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Info Banner (when showing system foods) */}
            {showSystemFoods && systemFoodsCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">
                                NutriLog Food Database
                            </p>
                            <p className="text-sm text-blue-700 mt-1">
                                Browse {systemFoodsCount} pre-loaded Indian foods with accurate macros.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Foods Grid */}
            {isLoading ? (
                <FoodsListSkeleton />
            ) : filteredFoods.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        {search 
                            ? "No foods found matching your search" 
                            : "No foods available"}
                    </p>
                    {!showSystemFoods && systemFoodsCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => handleFilterChange(showUserFoods, true)}
                        >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Show Indian Food Database
                        </Button>
                    )}
                    {!showUserFoods && userFoodsCount === 0 && (
                        <Button
                            className="bg-brand hover:bg-brand-100"
                            onClick={() => router.push("/foods/add")}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Food
                        </Button>
                    )}
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

            {/* Delete Confirmation Dialog */}
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
                        <AlertDialogAction 
                            className="bg-red-700 hover:bg-red-800" 
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}