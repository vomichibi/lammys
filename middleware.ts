import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('__session')?.value;
  const userEmail = request.cookies.get('user_email')?.value;
  const path = request.nextUrl.pathname;

  // Paths that don't require authentication
  if (path === '/login' || path === '/register' || path === '/') {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin routes
  if (path.startsWith('/admindash')) {
    if (userEmail !== 'team@lammys.au') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
