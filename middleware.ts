import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/booking',
  '/admindash',
  '/profile',
  '/orders',
]

// Add paths that are only accessible when NOT authenticated
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
]

// Add paths that require admin access
const adminPaths = [
  '/admindash',
]

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('__session')?.value // Firebase uses __session cookie
  const path = request.nextUrl.pathname

  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(protPath => 
    path.startsWith(protPath)
  )

  // Check if path is auth-only (login, register, etc.)
  const isAuthPath = authPaths.some(authPath => 
    path.startsWith(authPath)
  )

  // Check if path requires admin access
  const isAdminPath = adminPaths.some(adminPath => 
    path.startsWith(adminPath)
  )

  // If user is not authenticated and tries to access protected path
  if (isProtectedPath && !token) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and tries to access auth path
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // For admin paths, we'll let the client-side handle admin verification
  // since we can't verify custom claims in middleware

  return NextResponse.next()
}
