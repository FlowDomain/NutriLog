import { calculateMacroPercentages } from "./calculations";

export interface GradeResult {
    grade: "A" | "B" | "C" | "D";
    score: number;
    feedback: string;
}

export interface MacroTargets {
    carbs: number; // percentage
    protein: number; // percentage
    fats: number; // percentage
}

// Default macro targets (can be customized per user)
export const DEFAULT_MACRO_TARGETS: MacroTargets = {
    carbs: 40,
    protein: 30,
    fats: 30,
};

/**
 * Calculate meal grade based on how close macros are to targets
 * @param actualMacros - Actual macros in grams
 * @param targets - Target macro percentages
 * @returns Grade result with letter grade, score, and feedback
 */
export function calculateMealGrade(
    actualMacros: { carbs: number; protein: number; fats: number },
    targets: MacroTargets = DEFAULT_MACRO_TARGETS
): GradeResult {
    // Get actual percentages
    const actualPercentages = calculateMacroPercentages(actualMacros);

    // Calculate deviation from targets
    const carbsDeviation = Math.abs(actualPercentages.carbs - targets.carbs);
    const proteinDeviation = Math.abs(actualPercentages.protein - targets.protein);
    const fatsDeviation = Math.abs(actualPercentages.fats - targets.fats);

    // Average deviation
    const avgDeviation = (carbsDeviation + proteinDeviation + fatsDeviation) / 3;

    // Calculate score (100 - avgDeviation * penalty factor)
    // Max deviation of 33% (if one macro is 0% and target is 33%)
    const score = Math.max(0, Math.min(100, 100 - (avgDeviation * 2)));

    // Determine grade based on score
    let grade: "A" | "B" | "C" | "D";
    let feedback: string;

    if (score >= 85) {
        grade = "A";
        feedback = "Excellent macro balance! Your meal is well-balanced.";
    } else if (score >= 70) {
        grade = "B";
        feedback = "Good macro balance. Close to your targets.";
    } else if (score >= 50) {
        grade = "C";
        feedback = "Fair macro balance. Consider adjusting your portions.";
    } else {
        grade = "D";
        feedback = "Poor macro balance. This meal is far from your targets.";
    }

    // Add specific feedback
    const issues: string[] = [];
    if (carbsDeviation > 15) {
        if (actualPercentages.carbs > targets.carbs) {
            issues.push("too many carbs");
        } else {
            issues.push("not enough carbs");
        }
    }
    if (proteinDeviation > 15) {
        if (actualPercentages.protein > targets.protein) {
            issues.push("too much protein");
        } else {
            issues.push("not enough protein");
        }
    }
    if (fatsDeviation > 15) {
        if (actualPercentages.fats > targets.fats) {
            issues.push("too much fat");
        } else {
            issues.push("not enough fat");
        }
    }

    if (issues.length > 0) {
        feedback += ` This meal has ${issues.join(", ")}.`;
    }

    return {
        grade,
        score: Math.round(score),
        feedback,
    };
}