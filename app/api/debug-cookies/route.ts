import { NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  const allCookies = cookieStore.getAll();
  const cookieHeader = headersList.get("cookie");
  
  return NextResponse.json({
    serverCookies: allCookies.map(c => ({
      name: c.name,
      hasValue: !!c.value,
      valueStart: c.value?.substring(0, 20) + "...",
    })),
    rawCookieHeader: cookieHeader,
    totalCount: allCookies.length,
  });
}