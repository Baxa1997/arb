import { NextResponse } from "next/server";

export function middleware(request) {
  // Add server side route protection logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
