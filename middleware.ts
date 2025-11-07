// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Exact paths that don't need auth
// const PUBLIC_PATHS = ["/", "/sign-in", "/sign-up"];

// // Auth pages (redirect to dashboard if already logged in)
// const AUTH_PATHS = ["/sign-in", "/sign-up"];

// export async function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   console.log("[MIDDLEWARE] Path:", pathname); // DEBUG

//   // 1. ALWAYS allow API routes (including auth API)
//   if (pathname.startsWith("/api")) {
//     console.log("[MIDDLEWARE] API route - allowing"); // DEBUG
//     return NextResponse.next();
//   }

//   // 2. ALWAYS allow static files
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/favicon") ||
//     pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico)$/)
//   ) {
//     console.log("[MIDDLEWARE] Static file - allowing"); // DEBUG
//     return NextResponse.next();
//   }

//   const sessionToken = request.cookies.get("better-auth.session_token")?.value;
//   console.log("[MIDDLEWARE] Session token exists:", !!sessionToken); // DEBUG

//   // 3. Check if this is a public path
//   const isPublicPath = PUBLIC_PATHS.includes(pathname);
//   const isAuthPath = AUTH_PATHS.includes(pathname);

//   if (isPublicPath) {
//     console.log("[MIDDLEWARE] Public path"); // DEBUG
    
//     // If user is logged in and tries to access auth pages, redirect to dashboard
//     if (sessionToken && isAuthPath) {
//       console.log("[MIDDLEWARE] Logged in user on auth page - redirecting to dashboard"); // DEBUG
//       return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
    
//     console.log("[MIDDLEWARE] Allowing public path"); // DEBUG
//     return NextResponse.next();
//   }

//   // 4. For all other paths (dashboard, foods, meals, etc.), require auth
//   if (!sessionToken) {
//     console.log("[MIDDLEWARE] No session - redirecting to sign-in"); // DEBUG
//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("callbackUrl", pathname);
//     return NextResponse.redirect(signInUrl);
//   }

//   console.log("[MIDDLEWARE] Authenticated - allowing dashboard access"); // DEBUG
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all paths except:
//      * - api routes (handled above)
//      * - _next/static (static files)
//      * - _next/image (image optimization)
//      * - favicon.ico
//      * - public files
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };