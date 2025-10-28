import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Profile settings
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // Calorie and macro targets
  dailyCalorieTarget?: number;
  macroTargets?: {
    carbs: number; // percentage
    protein: number; // percentage
    fats: number; // percentage
  };
  
  // Goals
  goal?: 'lose_weight' | 'maintain' | 'gain_weight' | 'gain_muscle';
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 13,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: Number,
      min: 50,
      max: 300,
    },
    weight: {
      type: Number,
      min: 20,
      max: 500,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    dailyCalorieTarget: {
      type: Number,
      min: 800,
      max: 10000,
    },
    macroTargets: {
      carbs: {
        type: Number,
        default: 40,
        min: 0,
        max: 100,
      },
      protein: {
        type: Number,
        default: 30,
        min: 0,
        max: 100,
      },
      fats: {
        type: Number,
        default: 30,
        min: 0,
        max: 100,
      },
    },
    goal: {
      type: String,
      enum: ['lose_weight', 'maintain', 'gain_weight', 'gain_muscle'],
      default: 'maintain',
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = 
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);