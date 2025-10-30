import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { foodSchema } from "@/lib/utils/validators";
import { calculateCalories } from "@/lib/utils/calculations";
import { connectToDatabase } from "@/database/mongoose";
import { Food } from "@/database/models/food";

// GET - Get a single food
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const food = await Food.findById(params.id).lean();

        if (!food) {
            return NextResponse.json(
                { success: false, error: "Food not found" },
                { status: 404 }
            );
        }

        // Check access rights
        if (food.userId !== session.user.id && !food.isPublic) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: food,
        });
    } catch (error: any) {
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
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const food = await Food.findById(params.id);

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
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const food = await Food.findById(params.id);

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