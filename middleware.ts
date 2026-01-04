import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple password protection for /user-guide routes
// Password is set via GUIDE_PASSWORD environment variable in Vercel

const PROTECTED_PATHS = ['/user-guide'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this path needs protection
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  
  if (!isProtectedPath) {
    return NextResponse.next();
  }
  
  // Check for password cookie
  const passwordCookie = request.cookies.get('guide_auth');
  const expectedPassword = process.env.GUIDE_PASSWORD || 'gymsense2026';
  
  if (passwordCookie?.value === expectedPassword) {
    return NextResponse.next();
  }
  
  // Check for password in query param (for initial login)
  const passwordParam = request.nextUrl.searchParams.get('password');
  
  if (passwordParam === expectedPassword) {
    // Set cookie and redirect to clean URL
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.set('guide_auth', expectedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }
  
  // Redirect to password page
  const loginUrl = new URL('/user-guide/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/user-guide/:path*'],
};

