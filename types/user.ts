export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Gender = 'male' | 'female' | 'other';
export type Goal = 'lose_weight' | 'maintain' | 'gain_weight' | 'gain_muscle';

export interface MacroTargets {
    carbs: number;
    protein: number;
    fats: number;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    age?: number;
    gender?: Gender;
    height?: number;
    weight?: number;
    activityLevel?: ActivityLevel;
    dailyCalorieTarget?: number;
    macroTargets?: MacroTargets;
    goal?: Goal;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserProfileData {
    name?: string;
    age?: number;
    gender?: Gender;
    height?: number;
    weight?: number;
    activityLevel?: ActivityLevel;
    dailyCalorieTarget?: number;
    macroTargets?: MacroTargets;
    goal?: Goal;
}