import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get user from localStorage via cookie would be ideal, but Next.js middleware
  // can't access localStorage. This is a basic check using headers.
  // In production, use session cookies or JWT tokens instead.

  const { pathname } = request.nextUrl;

  // Allow login page and root redirect
  if (pathname === '/login' || pathname === '/') {
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // In production, verify JWT or session token here
    // For now, allow access (client-side will handle redirect if not logged in)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
