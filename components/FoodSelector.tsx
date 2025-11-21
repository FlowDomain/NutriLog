"use client";

import { useState, useEffect } from "react";
import { useFoods } from "@/hooks/useFoods";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, X, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface FoodSelectorProps {
    selectedFoods: SelectedFood[];
    onFoodsChange: (foods: SelectedFood[]) => void;
}

export function FoodSelector({ selectedFoods, onFoodsChange }: FoodSelectorProps) {
    const { foods, fetchFoods } = useFoods();
    const [search, setSearch] = useState("");
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        fetchFoods({ 
            search, 
            includePublic: true,
            includeSystem: true, // ✅ Include system foods
            category: selectedCategory === 'all' ? '' : selectedCategory,
        });
    }, [search, selectedCategory]);

    const calculateMacrosForQuantity = (
        baseMacros: any,
        baseServing: number,
        quantity: number
    ) => {
        const ratio = quantity / baseServing;
        return {
            carbs: Math.round(baseMacros.carbs * ratio * 10) / 10,
            protein: Math.round(baseMacros.protein * ratio * 10) / 10,
            fats: Math.round(baseMacros.fats * ratio * 10) / 10,
        };
    };

    const addFood = (food: any) => {
        const quantity = quantities[food._id] || food.servingSize;
        const macros = calculateMacrosForQuantity(food.macros, food.servingSize, quantity);
        const calories = Math.round(macros.carbs * 4 + macros.protein * 4 + macros.fats * 9);

        const newFood: SelectedFood = {
            foodId: food._id,
            foodName: food.name,
            servingSize: food.servingSize,
            quantity,
            calories,
            macros,
        };

        onFoodsChange([...selectedFoods, newFood]);
        setQuantities({ ...quantities, [food._id]: food.servingSize });
    };

    const removeFood = (foodId: string) => {
        onFoodsChange(selectedFoods.filter((f) => f.foodId !== foodId));
    };

    const updateQuantity = (foodId: string, quantity: number) => {
        const updatedFoods = selectedFoods.map((food) => {
            if (food.foodId === foodId) {
                const macros = calculateMacrosForQuantity(
                    {
                        carbs: food.macros.carbs * (food.servingSize / food.quantity),
                        protein: food.macros.protein * (food.servingSize / food.quantity),
                        fats: food.macros.fats * (food.servingSize / food.quantity)
                    },
                    food.servingSize,
                    quantity
                );
                const calories = Math.round(macros.carbs * 4 + macros.protein * 4 + macros.fats * 9);
                return { ...food, quantity, macros, calories };
            }
            return food;
        });
        onFoodsChange(updatedFoods);
    };

    const availableFoods = foods.filter(
        (food) => !selectedFoods.some((sf) => sf.foodId === food._id)
    );

    // Separate foods by source
    const userFoods = availableFoods.filter(f => f.source === 'user');
    const systemFoods = availableFoods.filter(f => f.source === 'system');
    const publicFoods = availableFoods.filter(f => f.source === 'public');

    // Categories for filtering
    const categories = [
        { value: 'all', label: 'All' },
        { value: 'bread', label: 'Breads' },
        { value: 'rice', label: 'Rice' },
        { value: 'curry', label: 'Curries' },
        { value: 'dal', label: 'Dals' },
        { value: 'snack', label: 'Snacks' },
        { value: 'south-indian', label: 'South Indian' },
        { value: 'dessert', label: 'Desserts' },
    ];

    const FoodCard = ({ food }: { food: any }) => (
        <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <p className="font-medium">{food.name}</p>
                            {food.source === 'system' && (
                                <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    NutriLog DB
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {food.calories} kcal per {food.servingSize}g
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            C: {food.macros.carbs}g | P: {food.macros.protein}g | F: {food.macros.fats}g
                        </p>
                        {food.tags && food.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                                {food.tags.slice(0, 3).map((tag: string, index:number) => (
                                    <Badge key={`${tag}-${index}`} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={quantities[food._id] || food.servingSize}
                            onChange={(e) =>
                                setQuantities({ ...quantities, [food._id]: Number(e.target.value) })
                            }
                            className="w-20"
                            min={1}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <span className="text-sm text-muted-foreground">g</span>
                        <Button
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                addFood(food);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-4">
            {/* Selected Foods */}
            {selectedFoods.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Selected Foods</h3>
                    {selectedFoods.map((food) => (
                        <Card key={food.foodId}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <p className="font-medium">{food.foodName}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {food.calories} kcal | C: {food.macros.carbs}g | P: {food.macros.protein}g | F: {food.macros.fats}g
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            value={food.quantity}
                                            onChange={(e) => updateQuantity(food.foodId, Number(e.target.value))}
                                            className="w-20"
                                            min={1}
                                        />
                                        <span className="text-sm text-muted-foreground">g</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFood(food.foodId)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Foods */}
            <div className="space-y-2">
                <h3 className="font-semibold">Add Foods</h3>
                
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search foods... (e.g., 'aloo paratha', 'roti')"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Category Filter */}
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2 pb-2">
                        {categories.map((cat) => (
                            <Button
                                key={cat.value}
                                variant={selectedCategory === cat.value ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.value)}
                            >
                                {cat.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>

                {/* Foods List with Tabs */}
                <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="all" className="flex-1">
                            All ({availableFoods.length})
                        </TabsTrigger>
                        <TabsTrigger value="indian" className="flex-1">
                            <Sparkles className="h-4 w-4 mr-1" />
                            NutriLog DB ({systemFoods.length})
                        </TabsTrigger>
                        <TabsTrigger value="mine" className="flex-1">
                            My Foods ({userFoods.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="mt-4">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {availableFoods.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    {search ? "No foods found" : "No foods available"}
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {availableFoods.map((food) => (
                                        <FoodCard key={food._id} food={food} />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="indian" className="mt-4">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {systemFoods.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No Indian foods found
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {systemFoods.map((food) => (
                                        <FoodCard key={food._id} food={food} />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="mine" className="mt-4">
                        <ScrollArea className="h-[400px] rounded-md border p-4">
                            {userFoods.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">
                                    No custom foods yet. Add your first food!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {userFoods.map((food) => (
                                        <FoodCard key={food._id} food={food} />
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}