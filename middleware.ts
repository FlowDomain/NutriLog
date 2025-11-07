import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/", "/sign-in", "/sign-up"];
const authPaths = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Always allow static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
  ) {
    return NextResponse.next();
  }

  // Try multiple cookie name variations
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("session_token")?.value;

  // Check if this is a public path
  const isPublicPath = publicPaths.includes(pathname);
  const isAuthPath = authPaths.includes(pathname);

  if (isPublicPath) {
    // If user is logged in and tries to access auth pages, redirect to dashboard
    if (sessionToken && isAuthPath) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // For dashboard routes, require session
  if (!sessionToken) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};