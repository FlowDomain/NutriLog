import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { foodSchema } from "@/lib/utils/validators";
import { calculateCalories } from "@/lib/utils/calculations";
import { connectToDatabase } from "@/database/mongoose";
import { Food } from "@/database/models/food";
import { SystemFood } from "@/database/models/SystemFood";

// GET - Get a single food
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const { id } = await context.params;

        // ✅ Try user foods first
        let food = await Food.findById(id).lean();

        if (food) {
            // Check access rights for user foods
            if (food.userId !== session.user.id && !food.isPublic) {
                return NextResponse.json(
                    { success: false, error: "Access denied" },
                    { status: 403 }
                );
            }

            return NextResponse.json({
                success: true,
                data: {
                    ...food,
                    source: 'user',
                    isEditable: food.userId === session.user.id,
                    isDeletable: food.userId === session.user.id,
                },
            });
        }

        // ✅ If not found in user foods, check system foods
        const systemFood = await SystemFood.findById(id).lean();

        if (systemFood) {
            return NextResponse.json({
                success: true,
                data: {
                    ...systemFood,
                    source: 'system',
                    isSystemFood: true,
                    isEditable: false,
                    isDeletable: false,
                },
            });
        }

        // Not found in either collection
        return NextResponse.json(
            { success: false, error: "Food not found" },
            { status: 404 }
        );
    } catch (error: any) {
        console.error('[FOOD API] GET error:', error);

        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch food" },
            { status: 500 }
        );
    }
}

// PUT - Update a food
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();
        const { id } = await context.params;

        // ✅ PROTECTION: Check if it's a system food first
        const isSystemFood = await SystemFood.findById(id);
        if (isSystemFood) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot edit system foods",
                    message: "Foods from the Indian database cannot be modified. Create a custom food instead."
                },
                { status: 403 } // Forbidden
            );
        }

        // Now check user foods
        const food = await Food.findById(id);

        if (!food) {
            return NextResponse.json(
                { success: false, error: "Food not found" },
                { status: 404 }
            );
        }

        // Check ownership
        if (food.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validatedData = foodSchema.parse(body);

        // Recalculate calories
        const calories = calculateCalories(validatedData.macros);

        // Update food
        food.name = validatedData.name;
        food.description = validatedData.description;
        food.servingSize = validatedData.servingSize;
        food.calories = calories;
        food.macros = validatedData.macros;
        food.category = validatedData.category;
        food.tags = validatedData.tags || [];
        food.isPublic = validatedData.isPublic || false;

        await food.save();

        return NextResponse.json({
            success: true,
            data: food,
            message: "Food updated successfully",
        });
    } catch (error: any) {
        console.error('[FOOD API] PUT error:', error);

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
            { success: false, error: "Failed to update food" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a food
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const { id } = await context.params;

        // ✅ PROTECTION: Check if it's a system food first
        const isSystemFood = await SystemFood.findById(id);
        if (isSystemFood) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Cannot delete system foods",
                    message: "Foods from the Indian database cannot be deleted."
                },
                { status: 403 } // Forbidden
            );
        }

        // Now check user foods
        const food = await Food.findById(id);

        if (!food) {
            return NextResponse.json(
                { success: false, error: "Food not found" },
                { status: 404 }
            );
        }

        // Check ownership
        if (food.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        await food.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Food deleted successfully",
        });
    } catch (error: any) {
        console.error('[FOOD API] DELETE error:', error);

        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to delete food" },
            { status: 500 }
        );
    }
}