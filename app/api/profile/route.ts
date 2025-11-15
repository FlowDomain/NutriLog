import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/database/mongoose";

const profileSchema = z.object({
  age: z.coerce.number().min(13).max(120).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  height: z.coerce.number().min(50).max(300).optional(),
  weight: z.coerce.number().min(20).max(500).optional(),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']).optional(),
  goal: z.enum(['lose_weight', 'maintain', 'gain_weight', 'gain_muscle']).optional(),
  dailyCalorieTarget: z.coerce.number().min(800).max(10000).optional(),
  macroTargets: z.object({
    carbs: z.coerce.number().min(0).max(100),
    protein: z.coerce.number().min(0).max(100),
    fats: z.coerce.number().min(0).max(100),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    console.log("[PROFILE API] GET request received");

    const session = await requireAuth();
    console.log("[PROFILE API] Session user ID:", session.user.id);

    await connectToDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not available");
    }

    // Use session data for user info (email, name)
    const user = {
      _id: session.user.id,
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      createdAt: session.user.createdAt || new Date(),
    };

    // Get profile info from profiles collection (if exists)
    const profilesCollection = db.collection('profiles');
    const profile = await profilesCollection.findOne({ userId: session.user.id });

    // Merge user data (name, email) with profile data (age, weight, etc.)
    const combinedData = {
      _id: user._id,
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      age: profile?.age,
      gender: profile?.gender,
      height: profile?.height,
      weight: profile?.weight,
      activityLevel: profile?.activityLevel,
      goal: profile?.goal,
      dailyCalorieTarget: profile?.dailyCalorieTarget,
      macroTargets: profile?.macroTargets,
      updatedAt: profile?.updatedAt || user.updatedAt,
    };

    console.log("[PROFILE API] Combined profile data retrieved");

    return NextResponse.json({
      success: true,
      data: combinedData,
    });
  } catch (error: any) {
    console.error("[PROFILE API] GET error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("=== [PROFILE API] PUT REQUEST START ===");

    const session = await requireAuth();
    console.log("[PROFILE API] Session user ID:", session.user.id);

    await connectToDatabase();

    const body = await request.json();
    console.log("[PROFILE API] Request body:", Object.keys(body));

    const validatedData = profileSchema.parse(body);
    console.log("[PROFILE API] Data validated successfully");

    // Validate macro targets sum to 100
    if (validatedData.macroTargets) {
      const sum =
        validatedData.macroTargets.carbs +
        validatedData.macroTargets.protein +
        validatedData.macroTargets.fats;

      if (Math.abs(sum - 100) > 0.1) {
        console.log("[PROFILE API] Macro sum validation failed:", sum);
        return NextResponse.json(
          { success: false, error: "Macro targets must sum to 100%" },
          { status: 400 }
        );
      }
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not available");
    }

    const profilesCollection = db.collection('profiles');
    
    // Better-Auth session already contains user email and name
    // Use session data directly instead of querying the database
    const user = {
      _id: session.user.id, // Use session user ID as _id
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      createdAt: session.user.createdAt || new Date(), // Fallback to current date if not available
    };
    
    console.log("[PROFILE API] Using session data for user info:", {
      id: user.id,
      email: user.email,
      name: user.name,
    });

    console.log("[PROFILE API] Looking for profile with userId:", session.user.id);

    // Check if profile exists
    const existingProfile = await profilesCollection.findOne({ userId: session.user.id });
    console.log("[PROFILE API] Existing profile found:", !!existingProfile);

    // Prepare update object
    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (validatedData.age !== undefined) updateFields.age = validatedData.age;
    if (validatedData.gender !== undefined) updateFields.gender = validatedData.gender;
    if (validatedData.height !== undefined) updateFields.height = validatedData.height;
    if (validatedData.weight !== undefined) updateFields.weight = validatedData.weight;
    if (validatedData.activityLevel !== undefined) updateFields.activityLevel = validatedData.activityLevel;
    if (validatedData.goal !== undefined) updateFields.goal = validatedData.goal;
    if (validatedData.dailyCalorieTarget !== undefined) updateFields.dailyCalorieTarget = validatedData.dailyCalorieTarget;
    if (validatedData.macroTargets !== undefined) updateFields.macroTargets = validatedData.macroTargets;

    console.log("[PROFILE API] Updating fields:", Object.keys(updateFields));

    let updatedProfile;

    if (!existingProfile) {
      console.log("[PROFILE API] Creating new profile document");

      const newProfileData = {
        userId: session.user.id,
        ...updateFields,
        createdAt: new Date(),
      };

      const insertResult = await profilesCollection.insertOne(newProfileData);
      console.log("[PROFILE API] Profile created with ID:", insertResult.insertedId);

      updatedProfile = await profilesCollection.findOne({ _id: insertResult.insertedId });
    } else {
      const updateResult = await profilesCollection.updateOne(
        { userId: session.user.id },
        { $set: updateFields }
      );

      console.log("[PROFILE API] MongoDB update result:", {
        matched: updateResult.matchedCount,
        modified: updateResult.modifiedCount,
      });

      if (updateResult.matchedCount === 0) {
        return NextResponse.json(
          { success: false, error: "Profile not found" },
          { status: 404 }
        );
      }

      updatedProfile = await profilesCollection.findOne({ userId: session.user.id });
    }

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found after update" },
        { status: 404 }
      );
    }

    console.log("[PROFILE API] Profile update complete, user data:", {
      hasEmail: !!user.email,
      hasName: !!user.name,
      email: user.email,
      name: user.name,
    });

    // Build response data - EXACTLY like GET endpoint
    const responseData = {
      _id: user._id,
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      age: updatedProfile.age,
      gender: updatedProfile.gender,
      height: updatedProfile.height,
      weight: updatedProfile.weight,
      activityLevel: updatedProfile.activityLevel,
      goal: updatedProfile.goal,
      dailyCalorieTarget: updatedProfile.dailyCalorieTarget,
      macroTargets: updatedProfile.macroTargets,
      updatedAt: updatedProfile.updatedAt,
    };

    console.log("[PROFILE API] Response data built:", {
      hasEmail: !!responseData.email,
      hasName: !!responseData.name,
      hasAge: !!responseData.age,
      email: responseData.email,
      name: responseData.name,
    });

    console.log("=== [PROFILE API] PUT REQUEST END - SUCCESS ===");

    return NextResponse.json({
      success: true,
      data: responseData,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("[PROFILE API] Update error:", error);
    console.error("[PROFILE API] Error stack:", error.stack);

    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (error.name === "ZodError") {
      console.log("[PROFILE API] Validation errors:", error.errors);
      return NextResponse.json(
        { success: false, error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update profile", details: error.message },
      { status: 500 }
    );
  }
}