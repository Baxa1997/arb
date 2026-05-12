import { NextResponse } from 'next/server';

const TEACHER_PATHS = ['/dashboard'];
const STUDENT_PATHS = ['/student'];

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // We rely on a cookie set after demo login OR Supabase session cookie
  // For Supabase: the auth helpers set sb-access-token
  // For demo: we set arb_demo_role cookie on login
  const demoRole   = req.cookies.get('arb_demo_role')?.value;
  const supaToken  = req.cookies.get('sb-access-token')?.value;
  const isAuthed   = !!demoRole || !!supaToken;

  // Protect teacher routes
  if (TEACHER_PATHS.some(p => pathname.startsWith(p))) {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect student routes
  if (STUDENT_PATHS.some(p => pathname.startsWith(p))) {
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/student/:path*'],
};
