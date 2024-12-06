import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
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
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession()
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
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and tries to access auth path
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If non-admin user tries to access admin path
  if (isAdminPath) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session?.user?.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return res
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
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
