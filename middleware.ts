import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ONLY redirect away from auth pages if already logged in
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    const sessionToken = request.cookies.get("better-auth.session_token")?.value;
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Allow everything else - let layout handle auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up"],
};