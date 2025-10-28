import { auth } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";

// Server-side session getter (cached)
export const getSession = cache(async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!sessionToken) {
        return null;
    }

    try {
        const session = await auth.api.getSession({
            headers: {
                cookie: `better-auth.session_token=${sessionToken}`,
            },
        });

        return session;
    } catch (error) {
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