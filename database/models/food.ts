import mongoose, { Schema, Document, Model } from 'mongoose';


export interface IFood extends Document {
    _id: string;
    userId: string; // Owner of this food entry
    name: string;
    description?: string;
    servingSize: number; // in grams
    calories: number;
    macros: {
        carbs: number; // in grams
        protein: number; // in grams
        fats: number; // in grams
    };
    isPublic: boolean; // Can other users see this?
    category?: string; // e.g., 'breakfast', 'snack', 'dessert'
    tags?: string[]; // e.g., ['indian', 'vegetarian', 'high-protein']
    createdAt: Date;
    updatedAt: Date;
}

const FoodSchema = new Schema<IFood>(
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
        description: {
            type: String,
            trim: true,
        },
        servingSize: {
            type: Number,
            required: true,
            min: 1,
        },
        calories: {
            type: Number,
            required: true,
            min: 0,
        },
        macros: {
            carbs: {
                type: Number,
                required: true,
                min: 0,
            },
            protein: {
                type: Number,
                required: true,
                min: 0,
            },
            fats: {
                type: Number,
                required: true,
                min: 0,
            },
        },
        isPublic: {
            type: Boolean,
            default: false,
        },
        category: {
            type: String,
            lowercase: true,
            trim: true,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
FoodSchema.index({ userId: 1, name: 1 });
FoodSchema.index({ isPublic: 1 });

export const Food: Model<IFood> =
    mongoose.models.Food || mongoose.model<IFood>('Food', FoodSchema);