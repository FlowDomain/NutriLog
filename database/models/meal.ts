import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMealFood {
    foodId: string;
    foodName: string;
    quantity: number; // in grams
    calories: number;
    macros: {
        carbs: number;
        protein: number;
        fats: number;
    };
}

export interface IMeal extends Document {
    _id: string;
    userId: string;
    name: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    date: Date;
    foods: IMealFood[];

    // Calculated totals
    totalCalories: number;
    totalMacros: {
        carbs: number;
        protein: number;
        fats: number;
    };

    // Grade based on macro balance
    grade: 'A' | 'B' | 'C' | 'D';
    gradeScore: number; // 0-100

    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const MealFoodSchema = new Schema<IMealFood>(
    {
        foodId: {
            type: String,
            required: true,
        },
        foodName: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        calories: {
            type: Number,
            required: true,
        },
        macros: {
            carbs: { type: Number, required: true },
            protein: { type: Number, required: true },
            fats: { type: Number, required: true },
        },
    },
    { _id: false }
);

const MealSchema = new Schema<IMeal>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        mealType: {
            type: String,
            required: true,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        foods: {
            type: [MealFoodSchema],
            required: true,
            validate: {
                validator: (foods: IMealFood[]) => foods.length > 0,
                message: 'Meal must have at least one food item',
            },
        },
        totalCalories: {
            type: Number,
            required: true,
            min: 0,
        },
        totalMacros: {
            carbs: { type: Number, required: true, min: 0 },
            protein: { type: Number, required: true, min: 0 },
            fats: { type: Number, required: true, min: 0 },
        },
        grade: {
            type: String,
            required: true,
            enum: ['A', 'B', 'C', 'D'],
        },
        gradeScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for user's meals on specific dates
MealSchema.index({ userId: 1, date: 1 });

export const Meal: Model<IMeal> =
    mongoose.models.Meal || mongoose.model<IMeal>('Meal', MealSchema);