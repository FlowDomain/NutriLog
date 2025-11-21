// models/SystemFood.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISystemFood extends Document {
    _id: string;
    name: string;
    description?: string;
    servingSize: number;
    calories: number;
    macros: {
        carbs: number;
        protein: number;
        fats: number;
    };
    category?: string;
    tags: string[];
    isActive: boolean;
    usageCount: number;
    searchKeywords: string[];
    createdAt: Date;
    updatedAt: Date;
}

const SystemFoodSchema = new Schema<ISystemFood>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true, // Index for fast search
        },
        description: {
            type: String,
            trim: true,
        },
        servingSize: {
            type: Number,
            required: true,
            min: 1,
            default: 100,
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
        category: {
            type: String,
            lowercase: true,
            trim: true,
            index: true, // Index for filtering
        },
        tags: {
            type: [String],
            default: ['indian', 'traditional'],
            index: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        searchKeywords: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for efficient queries
SystemFoodSchema.index({ name: 'text', description: 'text' }); // Full-text search
SystemFoodSchema.index({ isActive: 1, usageCount: -1 }); // Popular foods first
SystemFoodSchema.index({ category: 1, name: 1 }); // Category filtering

// Calculate calories before saving (if not provided)
SystemFoodSchema.pre('save', function (next) {
    if (!this.calories || this.calories === 0) {
        this.calories = Math.round(
            this.macros.carbs * 4 +
            this.macros.protein * 4 +
            this.macros.fats * 9
        );
    }
    next();
});

// Generate search keywords from name
SystemFoodSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        const keywords = this.name
            .toLowerCase()
            .split(/[\s,()-]+/)
            .filter(word => word.length > 2);

        this.searchKeywords = [...new Set(keywords)];
    }
    next();
});

export const SystemFood: Model<ISystemFood> =
    mongoose.models.SystemFood ||
    mongoose.model<ISystemFood>('SystemFood', SystemFoodSchema);