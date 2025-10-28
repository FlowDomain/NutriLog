import { Macros } from './food';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Grade = 'A' | 'B' | 'C' | 'D';


export interface MealFood {
    foodId: string;
    foodName: string;
    quantity: number;
    calories: number;
    macros: Macros;
}

export interface Meal {
    id: string;
    userId: string;
    name: string;
    mealType: MealType;
    date: string;
    foods: MealFood[];
    totalCalories: number;
    totalMacros: Macros;
    grade: Grade;
    gradeScore: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMealData {
    name: string;
    mealType: MealType;
    date: string;
    foods: {
        foodId: string;
        quantity: number;
    }[];
    notes?: string;
}

export interface UpdateMealData {
    name?: string;
    mealType?: MealType;
    foods?: {
        foodId: string;
        quantity: number;
    }[];
    notes?: string;
}