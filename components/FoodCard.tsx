"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Utensils, Sparkles } from "lucide-react";

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
        isPublic?: boolean;
        // ✅ New properties for system foods
        source?: 'user' | 'system' | 'public';
        isSystemFood?: boolean;
        isEditable?: boolean;
        isDeletable?: boolean;
        usageCount?: number;
    };
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    showActions?: boolean;
}

export function FoodCard({ food, onEdit, onDelete, showActions = true }: FoodCardProps) {
    // ✅ Check if this is a system food
    const isSystemFood = food.source === 'system' || food.isSystemFood;

    // ✅ Determine if actions should be shown
    const canEdit = showActions && onEdit && food.isEditable !== false && !isSystemFood;
    const canDelete = showActions && onDelete && food.isDeletable !== false && !isSystemFood;

    return (
        <Card className={isSystemFood ? "border-blue-200 bg-blue-50/30" : ""}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Utensils className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg">{food.name}</CardTitle>

                            {/* ✅ System Food Badge */}
                            {isSystemFood && (
                                <Badge variant="secondary" className="text-xs">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    NutriLog DB
                                </Badge>
                            )}
                        </div>

                        {food.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {food.description}
                            </p>
                        )}
                    </div>

                    {/* ✅ Only show actions for user's own foods */}
                    {(canEdit || canDelete) && (
                        <div className="flex gap-2">
                            {canEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit!(food._id)}
                                    title="Edit food"
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            )}
                            {canDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete!(food._id)}
                                    title="Delete food"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Serving Size & Calories */}
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

                {/* Macros */}
                <div>
                    <p className="text-sm font-medium mb-2">Macros</p>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="text-center p-2 rounded bg-blue-100">
                            <p className="text-xs text-muted-foreground">Carbs</p>
                            <p className="font-semibold">{food.macros.carbs}g</p>
                        </div>
                        <div className="text-center p-2 rounded bg-green-100">
                            <p className="text-xs text-muted-foreground">Protein</p>
                            <p className="font-semibold">{food.macros.protein}g</p>
                        </div>
                        <div className="text-center p-2 rounded bg-yellow-100">
                            <p className="text-xs text-muted-foreground">Fats</p>
                            <p className="font-semibold">{food.macros.fats}g</p>
                        </div>
                    </div>
                </div>

                {/* Tags, Category, Public badge */}
                {(food.category || food.tags?.length || food.isPublic) && (
                    <div className="flex flex-wrap gap-2">
                        {food.category && (
                            <Badge variant="outline">{food.category}</Badge>
                        )}
                        {food.tags?.slice(0, 3).map((tag, index) => (
                            <Badge key={`${tag}-${index}`} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                        {food.tags && food.tags.length > 3 && (
                            <Badge variant="secondary">
                                +{food.tags.length - 3}
                            </Badge>
                        )}
                        {food.isPublic && (
                            <Badge variant="default">Public</Badge>
                        )}
                    </div>
                )}

                {/* ✅ Usage count for system foods */}
                {isSystemFood && (
                    <p className="text-xs text-muted-foreground border-t pt-2">
                        {food.usageCount && food.usageCount > 0
                            ? `Used ${food.usageCount} ${food.usageCount === 1 ? "time" : "times"} by users`
                            : "Not used by any users yet"}
                    </p>
                )}


            </CardContent>
        </Card>
    );
}