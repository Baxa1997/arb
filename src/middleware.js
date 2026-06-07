import { NextResponse } from 'next/server';

const PROTECTED = ['/admin', '/dashboard', '/student', '/teach'];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Auth-gate only. Role enforcement happens in each route-group layout.
  // The app sets `aec_session` on login (both demo and Supabase modes), since
  // the Supabase JS client keeps its real session in localStorage, not cookies.
  const hasSession = !!req.cookies.get('aec_session')?.value
    || !!req.cookies.get('arb_demo_role')?.value;

  if (PROTECTED.some(p => pathname.startsWith(p)) && !hasSession) {
    const url = new URL('/login', req.url);
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/student/:path*', '/teach/:path*'],
};
