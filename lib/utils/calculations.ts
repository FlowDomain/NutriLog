export interface Macros {
    carbs: number;
    protein: number;
    fats: number;
}


export function roundToDecimal(value: number, decimals: number = 1): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Calculate calories from macros
export function calculateCalories(macros: Macros): number {
    // 1g carbs = 4 cal, 1g protein = 4 cal, 1g fat = 9 cal
    const calories = macros.carbs * 4 + macros.protein * 4 + macros.fats * 9;
    return Math.round(calories); // Always round to whole number
}
// Calculate macros for a specific quantity
export function calculateMacrosForQuantity(
    baseMacros: Macros,
    baseServingSize: number,
    quantity: number
): Macros {
    const ratio = quantity / baseServingSize;
    return {
        carbs: roundToDecimal(baseMacros.carbs * ratio, 1),
        protein: roundToDecimal(baseMacros.protein * ratio, 1),
        fats: roundToDecimal(baseMacros.fats * ratio, 1),
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