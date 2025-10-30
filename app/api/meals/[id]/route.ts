import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { connectToDatabase } from "@/database/mongoose";
import { Meal } from "@/database/models/meal";

// GET /api/meals/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const meal = await Meal.findById(params.id).lean();

        if (!meal) {
            return NextResponse.json(
                { success: false, error: "Meal not found" },
                { status: 404 }
            );
        }

        if (meal.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            data: meal,
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to fetch meal" },
            { status: 500 }
        );
    }
}

// DELETE /api/meals/[id]
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const meal = await Meal.findById(params.id);

        if (!meal) {
            return NextResponse.json(
                { success: false, error: "Meal not found" },
                { status: 404 }
            );
        }

        if (meal.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Access denied" },
                { status: 403 }
            );
        }

        await meal.deleteOne();

        return NextResponse.json({
            success: true,
            message: "Meal deleted successfully",
        });
    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to delete meal" },
            { status: 500 }
        );
    }
}
