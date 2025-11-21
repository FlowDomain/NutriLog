// app/api/foods/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { connectToDatabase } from "@/database/mongoose";
import { Food } from "@/database/models/food";
import { SystemFood } from "@/database/models/SystemFood";

// GET /api/foods - Fetch foods (both user foods and system foods)
export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || '';
        const includePublic = searchParams.get('includePublic') === 'true';
        const includeSystem = searchParams.get('includeSystem') !== 'false'; // Default true
        const limit = parseInt(searchParams.get('limit') || '50');

        const results: any[] = [];

        // Build search query
        const searchQuery: any = search
            ? { name: { $regex: search, $options: 'i' } }
            : {};

        if (category) {
            searchQuery.category = category;
        }

        // 1. Fetch USER'S OWN FOODS
        const userFoods = await Food.find({
            userId: session.user.id,
            ...searchQuery,
        })
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();

        results.push(
            ...userFoods.map((food) => ({
                ...food,
                _id: food._id.toString(),
                source: 'user', // Mark as user food
                isEditable: true,
                isDeletable: true,
            }))
        );

        // 2. Fetch PUBLIC FOODS from other users (if requested)
        if (includePublic) {
            const publicFoods = await Food.find({
                userId: { $ne: session.user.id },
                isPublic: true,
                ...searchQuery,
            })
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            results.push(
                ...publicFoods.map((food) => ({
                    ...food,
                    _id: food._id.toString(),
                    source: 'public',
                    isEditable: false, // Can't edit other users' foods
                    isDeletable: false,
                }))
            );
        }

        // 3. Fetch SYSTEM FOODS (Indian food database)
        if (includeSystem) {
            const systemQuery: any = {
                isActive: true,
                ...searchQuery,
            };

            const systemFoods = await SystemFood.find(systemQuery)
                .limit(limit)
                .sort({ usageCount: -1, name: 1 }) // Popular foods first
                .lean();

            results.push(
                ...systemFoods.map((food) => ({
                    ...food,
                    _id: food._id.toString(),
                    source: 'system', // Mark as system food
                    isEditable: false, // Can't edit system foods
                    isDeletable: false,
                    isSystemFood: true, // Flag for UI
                }))
            );
        }

        // Sort combined results
        // Priority: user foods > system foods (popular) > public foods
        results.sort((a, b) => {
            if (a.source === 'user' && b.source !== 'user') return -1;
            if (a.source !== 'user' && b.source === 'user') return 1;

            if (a.source === 'system' && b.source === 'system') {
                return (b.usageCount || 0) - (a.usageCount || 0);
            }

            return 0;
        });

        // Limit final results
        const finalResults = results.slice(0, limit);

        return NextResponse.json({
            success: true,
            data: finalResults,
            count: finalResults.length,
        });
    } catch (error: any) {
        console.error('[FOODS API] GET error:', error);

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

// POST /api/foods - Create new user food (unchanged)
export async function POST(request: NextRequest) {
    try {
        const session = await requireAuth();
        await connectToDatabase();

        const body = await request.json();

        const newFood = await Food.create({
            userId: session.user.id,
            ...body,
        });

        return NextResponse.json({
            success: true,
            data: newFood,
            message: "Food created successfully",
        });
    } catch (error: any) {
        console.error('[FOODS API] POST error:', error);

        if (error.message === "Unauthorized") {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to create food" },
            { status: 500 }
        );
    }
}