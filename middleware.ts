import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/sign-in", "/sign-up", "/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Proper typed call for Better Auth session lookup
  const sessionResponse = await auth.api.getSession({
    headers: request.headers,
  });

  const session = sessionResponse?.session; // ✅ this fixes TS error

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const isAuthPage = ["/sign-in", "/sign-up"].includes(pathname);

  // Logged-in users should not see login/register pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Not logged in but trying to access protected route
  if (!session && !isPublic) {
    return NextResponse.redirect(
      new URL(`/sign-in?callbackUrl=${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
