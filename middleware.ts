import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that require authentication
const protectedPaths = [
  '/profile',
  '/orders',
  '/dashboard',
  '/admindash'
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
      // Check if user is admin
      const isAdmin = session.user.email === 'team@lammys.au'
      return NextResponse.redirect(new URL(isAdmin ? '/admindash/dashboard' : '/dashboard', request.url))
    }

    // If non-admin trying to access admin dashboard
    if (session?.user.email !== 'team@lammys.au' && path.startsWith('/admindash')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
