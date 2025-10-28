import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDailyLog extends Document {
    _id: string;
    userId: string;
    date: Date;

    // Daily totals
    totalCalories: number;
    totalMacros: {
        carbs: number;
        protein: number;
        fats: number;
    };

    // Meal count
    mealCount: number;
    mealIds: string[];

    // Average grade for the day
    averageGrade: string;
    averageGradeScore: number;

    // Target comparison
    calorieTarget?: number;
    macroTargets?: {
        carbs: number;
        protein: number;
        fats: number;
    };

    // Achievement
    metCalorieGoal?: boolean;
    metMacroGoals?: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const DailyLogSchema = new Schema<IDailyLog>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        totalCalories: {
            type: Number,
            required: true,
            default: 0,
        },
        totalMacros: {
            carbs: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            fats: { type: Number, default: 0 },
        },
        mealCount: {
            type: Number,
            default: 0,
        },
        mealIds: {
            type: [String],
            default: [],
        },
        averageGrade: {
            type: String,
            default: 'D',
        },
        averageGradeScore: {
            type: Number,
            default: 0,
        },
        calorieTarget: Number,
        macroTargets: {
            carbs: Number,
            protein: Number,
            fats: Number,
        },
        metCalorieGoal: Boolean,
        metMacroGoals: Boolean,
    },
    {
        timestamps: true,
    }
);

// Unique constraint: one log per user per day
DailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const DailyLog: Model<IDailyLog> =
    mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);

