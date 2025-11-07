import { auth } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";

// Server-side session getter (cached)
export const getSession = cache(async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    console.log("[SESSION CHECK] Token exists:", !!sessionToken); // DEBUG

    if (!sessionToken) {
        console.log("[SESSION CHECK] No session token found"); // DEBUG
        return null;
    }

    try {
        const session = await auth.api.getSession({
            headers: {
                cookie: `better-auth.session_token=${sessionToken}`,
            },
        });

        console.log("[SESSION CHECK] Session data:", session ? "Valid" : "Invalid"); // DEBUG

        return session;
    } catch (error) {
        console.error("[SESSION CHECK] Error:", error); // DEBUG
        return null;
    }
});

// Check if user is authenticated
export async function requireAuth() {
    const session = await getSession();

    if (!session) {
        throw new Error("Unauthorized");
    }

    return session;
}

// Get current user
export async function getCurrentUser() {
    const session = await getSession();
    return session?.user || null;
}