import { connectToDatabase } from "@/database/mongoose";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = async () => {
    if (authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) throw new Error("MongoDB connection not found");

    // Get the domain from environment
    const appUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const domain = new URL(appUrl).hostname; // This gives: "nutri-log-beta.vercel.app" (no dot prefix!)

    console.log("[AUTH] Configuring with domain:", domain);

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

        // CRITICAL: Set explicit cookie configuration with correct domain
        advanced: {
            cookies: {
                sessionToken: {
                    name: "session_token", // Simpler name
                    attributes: {
                        domain: domain, // Exact domain, no dot prefix!
                        path: "/",
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
                    },
                },
            },
            // Disable cross-subdomain cookies
            crossSubDomainCookies: {
                enabled: false, // This prevents the dot prefix!
            },
        },

        trustedOrigins: [
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        ],

        plugins: [nextCookies()],
    });

    console.log("[AUTH] Auth instance created with domain:", domain);

    return authInstance;
};

export const auth = await getAuth();
export type Session = typeof auth.$Infer.Session;