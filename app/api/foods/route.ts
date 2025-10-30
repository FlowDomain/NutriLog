import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { foodSchema } from "@/lib/utils/validators";
import { calculateCalories } from "@/lib/utils/calculations";
import { connectToDatabase } from "@/database/mongoose";
import { Food } from "@/database/models/food";

// GET /api/foods - Get all foods for the user
export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const search = searchParams.get("search");
        const includePublic = searchParams.get("includePublic") === "true";

        // Build query
        const query: any = {
            $or: [
                { userId: session.user.id },
                ...(includePublic ? [{ isPublic: true }] : []),
            ],
        };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const foods = await Food.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({
            success: true,
            data: foods,
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch foods" },
            { status: 500 }
        );
    }
}

// POST /api/foods - Create a new food
export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const body = await request.json();

        // Validate input
        const validatedData = foodSchema.parse(body);

        // Calculate calories
        const calories = calculateCalories(validatedData.macros);

        // Create food
        const food = await Food.create({
            userId: session.user.id,
            name: validatedData.name,
            description: validatedData.description,
            servingSize: validatedData.servingSize,
            calories,
            macros: validatedData.macros,
            category: validatedData.category,
            tags: validatedData.tags || [],
            isPublic: validatedData.isPublic || false,
        });

        return NextResponse.json({
            success: true,
            data: food,
            message: "Food created successfully",
        }, { status: 201 });
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
            { success: false, error: "Failed to create food" },
            { status: 500 }
        );
    }
}