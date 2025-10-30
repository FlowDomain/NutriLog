export interface Macros {
    carbs: number;
    protein: number;
    fats: number;
}

// Calculate calories from macros
export function calculateCalories(macros: Macros): number {
    // 1g carbs = 4 cal, 1g protein = 4 cal, 1g fat = 9 cal
    return Math.round(
        macros.carbs * 4 + macros.protein * 4 + macros.fats * 9
    );
}
// Calculate macros for a specific quantity
export function calculateMacrosForQuantity(
    baseMacros: Macros,
    baseServingSize: number,
    quantity: number
): Macros {
    const ratio = quantity / baseServingSize;
    return {
        carbs: Math.round(baseMacros.carbs * ratio * 10) / 10,
        protein: Math.round(baseMacros.protein * ratio * 10) / 10,
        fats: Math.round(baseMacros.fats * ratio * 10) / 10,
    };
}
// Calculate macro percentages
export function calculateMacroPercentages(macros: Macros): {
    carbs: number;
    protein: number;
    fats: number;
} {
    const totalCals = calculateCalories(macros);

    if (totalCals === 0) {
        return { carbs: 0, protein: 0, fats: 0 };
    }

    return {
        carbs: Math.round((macros.carbs * 4 / totalCals) * 100),
        protein: Math.round((macros.protein * 4 / totalCals) * 100),
        fats: Math.round((macros.fats * 9 / totalCals) * 100),
    };
}