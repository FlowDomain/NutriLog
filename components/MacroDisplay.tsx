"use client";

import { Progress } from "@/components/ui/progress";

interface MacroDisplayProps {
    macros: {
        carbs: number;
        protein: number;
        fats: number;
    };
    calories: number;
    showPercentages?: boolean;
}

export function MacroDisplay({ macros, calories, showPercentages = true }: MacroDisplayProps) {
    const carbsCals = macros.carbs * 4;
    const proteinCals = macros.protein * 4;
    const fatsCals = macros.fats * 9;

    const carbsPercent = calories > 0 ? Math.round((carbsCals / calories) * 100) : 0;
    const proteinPercent = calories > 0 ? Math.round((proteinCals / calories) * 100) : 0;
    const fatsPercent = calories > 0 ? Math.round((fatsCals / calories) * 100) : 0;

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">Carbs</span>
                    <span className="text-sm font-semibold">
                        {macros.carbs}g {showPercentages && `(${carbsPercent}%)`}
                    </span>
                </div>
                <Progress value={carbsPercent} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
            </div>

            <div className="space-y-2"> 
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Protein</span>
                    <span className="text-sm font-semibold">
                        {macros.protein}g {showPercentages && `(${proteinPercent}%)`}
                    </span>
                </div>
                <Progress value={proteinPercent} className="h-2 bg-green-100" indicatorClassName="bg-green-500" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-yellow-700">Fats</span>
                    <span className="text-sm font-semibold">
                        {macros.fats}g {showPercentages && `(${fatsPercent}%)`}
                    </span>
                </div>
                <Progress value={fatsPercent} className="h-2 bg-yellow-100" indicatorClassName="bg-yellow-500" />
            </div>
        </div>
    );
}
