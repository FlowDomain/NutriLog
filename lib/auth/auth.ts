import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { connectToDatabase } from "@/database/mongoose";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    console.log("[AUTH] Initializing Better-Auth..."); // DEBUG

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection not found");

    authInstance = betterAuth({
        database: mongodbAdapter(db as any),
        secret: process.env.BETTER_AUTH_SECRET,
        baseURL: process.env.BETTER_AUTH_URL,

        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
        },
        user: {
            additionalFields: {
                age: {
                    type: "number",
                    required: false,
                },
                gender: {
                    type: "string",
                    required: false,
                },
                height: {
                    type: "number",
                    required: false,
                },
                weight: {
                    type: "number",
                    required: false,
                },
                activityLevel: {
                    type: "string",
                    required: false,
                    defaultValue: "moderate",
                },
                dailyCalorieTarget: {
                    type: "number",
                    required: false,
                },
                goal: {
                    type: "string",
                    required: false,
                    defaultValue: "maintain",
                },
            },
        },
        advanced: {
            cookiePrefix: "better-auth",
            crossSubDomainCookies: {
                enabled: true,
            },
            cookies: {
                sessionToken: {
                    name: "session_token",
                    attributes: {
                        sameSite: "lax", // Important for cross-origin
                        secure: process.env.NODE_ENV === "production", // HTTPS only in prod
                        httpOnly: true,
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                    },
                },
            },
        },
        trustedOrigins: [
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        ],
        plugins: [nextCookies()],
    });

    return authInstance;
};

export const auth = await getAuth();

export type Session = typeof auth.$Infer.Session;