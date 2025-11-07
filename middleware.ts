import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("[MIDDLEWARE DISABLED] Path:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [],  // Don't match anything
};