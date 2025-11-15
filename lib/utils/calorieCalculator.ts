export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type Goal = 'lose_weight' | 'maintain' | 'gain_weight' | 'gain_muscle'

const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Hard exercise 6-7 days/week
    very_active: 1.9,    // Very hard exercise, physical job
};

const GOAL_ADJUSTMENTS = {
    lose_weight: -500,   // 500 cal deficit for ~0.5kg/week loss
    maintain: 0,         // No adjustment
    gain_weight: 300,    // 300 cal surplus for slow gain
    gain_muscle: 500,    // 500 cal surplus for muscle building
};


//  * Calculate BMR using Mifflin-St Jeor Equation
//  * Most accurate formula for modern populations

export function calculateBMR(
    weight: number,
    height: number,
    age: number,
    gender: Gender,
): number {
    if (gender === 'male') {
        return 10 * weight + 6.25 * height - 5 * age + 5
    } else if (gender === 'female') {
        return 10 * weight + 6.25 * height - 5 * age - 161
    } else {
        const male = 10 * weight + 6.25 * height - 5 * age + 5
        const female = 10 * weight + 6.25 * height - 5 * age - 161
        return (male + female) / 2
    }
}

//  * Calculate TDEE (Total Daily Energy Expenditure)
//  * BMR * Activity Level

export function calculateTDEE(
    bmr: number,
    activityLevel: ActivityLevel
): number {
    return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel])
}

//  Calculate recomended calories as per goal

export function calculateRecommendedCalories(
    weight: number,
    height: number,
    age: number,
    gender: Gender,
    activityLevel: ActivityLevel,
    goal: Goal,
): number {
    const bmr = (calculateBMR(weight, height, age, gender))
    const tdee = calculateTDEE(bmr, activityLevel)
    const adjustment = GOAL_ADJUSTMENTS[goal]

    return Math.round(tdee + adjustment)
}

// Get recomemded macro ratios based on goal

export function getRecommendedMacros(goal: Goal): {
    carbs: number,
    protein: number,
    fats: number,
} {
    switch (goal) {
        case 'lose_weight':
            return { carbs: 35, protein: 35, fats: 30 }       // Higher protein for satiety
        case 'maintain':
            return { carbs: 40, protein: 30, fats: 30 }       // Balanced
        case 'gain_weight':
            return { carbs: 45, protein: 25, fats: 30 }       // Higher carbs for energy
        case 'gain_muscle':
            return { carbs: 40, protein: 35, fats: 25 }       // High protein for muscle
        default:
            return { carbs: 40, protein: 30, fats: 30 }
    }
}

// Calculate BMI

export function calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

// Get BMI category

export function getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal weight'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
}