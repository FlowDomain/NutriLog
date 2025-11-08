import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("[MIDDLEWARE] ===== REQUEST DEBUG =====");
  console.log("[MIDDLEWARE] Path:", pathname);
  console.log("[MIDDLEWARE] All request cookies:",
    request.cookies.getAll().map(c => ({
      name: c.name,
      hasValue: !!c.value,
    }))
  );

  // Only redirect away from auth pages if logged in
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    // Try to find ANY session-related cookie
    const allCookies = request.cookies.getAll();
    const sessionCookie = allCookies.find(c =>
      c.name.includes('session') ||
      c.name.includes('auth') ||
      c.name.includes('token')
    );

    console.log("[MIDDLEWARE] Session cookie found:", sessionCookie?.name);

    if (sessionCookie?.value) {
      console.log("[MIDDLEWARE] Has session, redirecting to dashboard");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  console.log("[MIDDLEWARE] ===== END DEBUG =====");
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};