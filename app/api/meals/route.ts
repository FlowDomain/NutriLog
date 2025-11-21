import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { calculateMacrosForQuantity, calculateCalories } from "@/lib/utils/calculations";
import { calculateMealGrade, DEFAULT_MACRO_TARGETS } from "@/lib/utils/grading";
import { z } from "zod";
import { connectToDatabase } from "@/database/mongoose";
import { Meal } from "@/database/models/meal";
import { Food } from "@/database/models/food"; // ✅ Import SystemFood
import { User } from "@/database/models/user";
import { SystemFood } from "@/database/models/SystemFood";

const mealSchema = z.object({
    name: z.string().min(1, "Name is required"),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    date: z.string(),
    foods: z.array(z.object({
        foodId: z.string(),
        quantity: z.number().min(1),
    })).min(1, "At least one food is required"),
    notes: z.string().optional(),
});

// GET - Get user's meals
export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: any = { userId: session.user.id };

        if (date) {
            const dateObj = new Date(date);
            const nextDay = new Date(dateObj);
            nextDay.setDate(nextDay.getDate() + 1);
            query.date = { $gte: dateObj, $lt: nextDay };
        } else if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const meals = await Meal.find(query).sort({ date: -1, createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: meals,
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch meals" },
            { status: 500 }
        );
    }
}

// POST - Create a new meal
export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const body = await request.json();
        const validatedData = mealSchema.parse(body);

        console.log('[MEALS API] Creating meal with foods:', validatedData.foods);

        // ✅ CRITICAL FIX: Search in BOTH Food and SystemFood collections
        const foodIds = validatedData.foods.map((f) => f.foodId);
        
        // Search in user foods
        const userFoods = await Food.find({ _id: { $in: foodIds } }).lean();
        console.log('[MEALS API] Found user foods:', userFoods.length);
        
        // Search in system foods
        const systemFoods = await SystemFood.find({ _id: { $in: foodIds } }).lean();
        console.log('[MEALS API] Found system foods:', systemFoods.length);
        
        // Combine both
        const allFoods = [...userFoods, ...systemFoods];
        console.log('[MEALS API] Total foods found:', allFoods.length);

        if (allFoods.length !== foodIds.length) {
            console.error('[MEALS API] Missing foods:', {
                requested: foodIds.length,
                found: allFoods.length,
                requestedIds: foodIds,
                foundIds: allFoods.map(f => f._id.toString())
            });
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Some foods not found",
                    details: {
                        requested: foodIds.length,
                        found: allFoods.length
                    }
                },
                { status: 404 }
            );
        }

        // Calculate totals
        const mealFoods = validatedData.foods.map((item) => {
            const food = allFoods.find((f) => f._id.toString() === item.foodId);
            if (!food) {
                console.error('[MEALS API] Food not found in combined list:', item.foodId);
                throw new Error(`Food not found: ${item.foodId}`);
            }

            const macros = calculateMacrosForQuantity(
                food.macros,
                food.servingSize,
                item.quantity
            );

            const calories = calculateCalories(macros);

            return {
                foodId: food._id.toString(),
                foodName: food.name,
                quantity: item.quantity,
                calories,
                macros,
            };
        });

        const totalMacros = mealFoods.reduce(
            (acc, food) => ({
                carbs: acc.carbs + food.macros.carbs,
                protein: acc.protein + food.macros.protein,
                fats: acc.fats + food.macros.fats,
            }),
            { carbs: 0, protein: 0, fats: 0 }
        );

        const totalCalories = mealFoods.reduce((acc, food) => acc + food.calories, 0);

        // Get user's macro targets
        const user = await User.findById(session.user.id).lean();
        const macroTargets = user?.macroTargets || DEFAULT_MACRO_TARGETS;

        // Calculate grade
        const gradeResult = calculateMealGrade(totalMacros, macroTargets);

        console.log('[MEALS API] Creating meal with:', {
            totalCalories,
            totalMacros,
            grade: gradeResult.grade,
            foodsCount: mealFoods.length
        });

        // Create meal
        const meal = await Meal.create({
            userId: session.user.id,
            name: validatedData.name,
            mealType: validatedData.mealType,
            date: new Date(validatedData.date),
            foods: mealFoods,
            totalCalories,
            totalMacros,
            grade: gradeResult.grade,
            gradeScore: gradeResult.score,
            notes: validatedData.notes,
        });

        // ✅ Increment usage count for system foods
        const systemFoodIds = systemFoods.map(f => f._id);
        if (systemFoodIds.length > 0) {
            await SystemFood.updateMany(
                { _id: { $in: systemFoodIds } },
                { $inc: { usageCount: 1 } }
            );
            console.log('[MEALS API] Updated usage count for system foods');
        }

        console.log('[MEALS API] Meal created successfully:', meal._id);

        return NextResponse.json({
            success: true,
            data: { ...meal.toObject(), gradeResult },
            message: "Meal logged successfully",
        }, { status: 201 });
    } catch (error: any) {
        console.error('[MEALS API] Error:', error);
        
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        if (error.name === "ZodError") {
            return NextResponse.json(
                { success: false, error: "Invalid input", details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { 
                success: false, 
                error: "Failed to create meal",
                details: error.message 
            },
            { status: 500 }
        );
    }
}