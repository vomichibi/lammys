import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

<<<<<<< HEAD
// Add paths that require authentication
const protectedPaths = [
  '/profile',
  '/orders',
  '/dashboard'
]

// Add paths that are only accessible when NOT authenticated
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
]

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })
    
    // Refresh session if needed
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      throw sessionError
    }

    const path = request.nextUrl.pathname

    // Check if path requires authentication
    const isProtectedPath = protectedPaths.some(protPath => 
      path.startsWith(protPath)
    )

    // Check if path is auth-only (login, register, etc.)
    const isAuthPath = authPaths.some(authPath => 
      path.startsWith(authPath)
    )

    // If path requires authentication and user is not authenticated
    if (isProtectedPath && !session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If auth path and user is authenticated
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
=======
export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const path = request.nextUrl.pathname

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If not logged in and trying to access protected routes
    if (!session && (path.startsWith('/dashboard') || path.startsWith('/admindash'))) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }

    // If logged in and trying to access auth routes
    if (session && (path === '/login' || path === '/register')) {
      const isAdmin = session.user.email === 'team@lammys.au'
      const redirectUrl = new URL(isAdmin ? '/admindash' : '/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If admin trying to access regular dashboard
    if (session?.user.email === 'team@lammys.au' && path.startsWith('/dashboard')) {
      const redirectUrl = new URL('/admindash', request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // If non-admin trying to access admin dashboard
    if (session?.user.email !== 'team@lammys.au' && path.startsWith('/admindash')) {
      const redirectUrl = new URL('/dashboard', request.url)
      return NextResponse.redirect(redirectUrl)
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
<<<<<<< HEAD
    return NextResponse.redirect(new URL('/login', request.url))
=======
    return res
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
  }
}

export const config = {
  matcher: [
<<<<<<< HEAD
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
=======
    '/dashboard/:path*',
    '/admindash/:path*',
    '/login',
    '/register'
>>>>>>> 9b3c2d631955f7b6202f0f164032c3d88ff88ed7
  ],
}
