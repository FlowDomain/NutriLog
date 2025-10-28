import { Macros } from './food';
import { MacroTargets } from './user';

export interface DailyLog {
    id: string;
    userId: string;
    date: string;
    totalCalories: number;
    totalMacros: Macros;
    mealCount: number;
    mealIds: string[];
    averageGrade: string;
    averageGradeScore: number;
    calorieTarget?: number;
    macroTargets?: MacroTargets;
    metCalorieGoal?: boolean;
    metMacroGoals?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface DailySummary {
    date: string;
    calories: number;
    macros: Macros;
    mealCount: number;
    averageGrade: string;
    metGoals: boolean;
}

export interface WeeklySummary {
    startDate: string;
    endDate: string;
    totalCalories: number;
    averageCaloriesPerDay: number;
    totalMacros: Macros;
    averageMacrosPerDay: Macros;
    totalMeals: number;
    averageGrade: string;
    dailyLogs: DailySummary[];
}

export interface MacroDistribution {
    carbs: number;
    protein: number;
    fats: number;
}

export interface CalorieChart {
    date: string;
    calories: number;
    target?: number;
}

export interface MacroChart {
    date: string;
    carbs: number;
    protein: number;
    fats: number;
}