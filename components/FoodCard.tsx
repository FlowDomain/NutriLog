"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Utensils } from "lucide-react";

interface FoodCardProps {
    food: {
        _id: string;
        name: string;
        description?: string;
        servingSize: number;
        calories: number;
        macros: {
            carbs: number;
            protein: number;
            fats: number;
        };
        category?: string;
        tags?: string[];
        isPublic: boolean;
    };
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export function FoodCard({ food, onEdit, onDelete, showActions = true }: FoodCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Utensils className="h-5 w-5 text-primary"/>
                        <CardTitle className="text-lg">{food.name}</CardTitle>
                    </div>
                    {showActions && (
                        <div className="flex gap-2">
                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(food._id)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(food._id)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
                {food.description && (
                    <p className="text-sm text-muted-foreground">{food.description}</p>
                )}
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
                        <div className="text-center p-2 rounded bg-blue-50">
                            <p className="text-xs text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{food.macros.carbs}g</p>
                        </div>
                        <div className="text-center p-2 rounded bg-green-50">
                            <p className="text-xs text-muted-foreground">Protein</p>
                            <p className="font-semibold">{food.macros.protein}g</p>
                        </div>
                        <div className="text-center p-2 rounded bg-yellow-50">
                            <p className="text-xs text-muted-foreground">Fats</p>
                            <p className="font-semibold">{food.macros.fats}g</p>
                        </div>
                    </div>
                </div>

                {(food.category || food.tags?.length || food.isPublic) && (
                    <div className="flex flex-wrap gap-2">
                        {food.category && <Badge variant="outline">{food.category}</Badge>}
                        {food.tags?.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                        {food.isPublic && (
                            <Badge variant="default">Public</Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}