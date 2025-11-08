import { getAuth } from "./auth";
import { cookies } from "next/headers";
import { cache } from "react";

export const getSession = cache(async () => {
  try {
    const auth = await getAuth();
    const cookieStore = await cookies();
    
    // Get ALL cookies
    const allCookies = cookieStore.getAll();
    console.log("[SESSION] ===== COOKIE DEBUG START =====");
    console.log("[SESSION] Total cookies found:", allCookies.length);
    
    // Log every single cookie
    allCookies.forEach((cookie, index) => {
      console.log(`[SESSION] Cookie ${index + 1}:`, {
        name: cookie.name,
        hasValue: !!cookie.value,
        valueLength: cookie.value?.length || 0,
      });
    });
    
    // Try to find ANY cookie that might be the session
    const possibleSessionCookies = allCookies.filter(c => 
      c.name.toLowerCase().includes('session') ||
      c.name.toLowerCase().includes('auth') ||
      c.name.toLowerCase().includes('token')
    );
    
    console.log("[SESSION] Possible session cookies:", possibleSessionCookies.map(c => c.name));
    
    // Try all possible names
    let sessionToken: string | undefined;
    let cookieName: string | undefined;
    
    const namesToTry = [
      "session_token",
      "session-token",
      "better-auth.session_token",
      "better-auth.session-token",
      "better-auth_session_token",
      "auth_token",
      "auth-token",
      ...possibleSessionCookies.map(c => c.name), // Try any cookie with session/auth in name
    ];
    
    console.log("[SESSION] Trying cookie names:", namesToTry);
    
    for (const name of namesToTry) {
      const cookie = cookieStore.get(name);
      if (cookie?.value) {
        sessionToken = cookie.value;
        cookieName = name;
        console.log("[SESSION] ✓ Found token with name:", name);
        break;
      }
    }
    
    console.log("[SESSION] Final result - Token found:", !!sessionToken, "Name:", cookieName);
    console.log("[SESSION] ===== COOKIE DEBUG END =====");

    if (!sessionToken) {
      console.log("[SESSION] No session token found after trying all names");
      return null;
    }

    console.log("[SESSION] Attempting to validate session...");
    
    // Try to validate with Better-Auth using the found cookie name
    const session = await auth.api.getSession({
      headers: {
        // Try multiple formats
        cookie: [
          `${cookieName}=${sessionToken}`,
          `session_token=${sessionToken}`,
          `better-auth.session_token=${sessionToken}`,
        ].join("; "),
      },
    });

    console.log("[SESSION] Validation result:", !!session);
    if (session) {
      console.log("[SESSION] ✓ Session valid for user:", session.user?.email);
    } else {
      console.log("[SESSION] ✗ Session validation failed");
    }

    return session;
  } catch (error) {
    console.error("[SESSION] Error during session check:", error);
    return null;
  }
});

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}