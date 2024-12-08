import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that are only accessible when NOT authenticated
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
]

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next()
    const path = request.nextUrl.pathname
    
    // Initialize Supabase client with environment variables
    const supabase = createMiddlewareClient({ 
      req: request, 
      res,
      options: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })
    
    // Check if user is authenticated
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Supabase auth error:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if path is auth-only (login, register, etc.)
    const isAuthPath = authPaths.some(authPath => path.startsWith(authPath))

    // If user is authenticated and tries to access auth path
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // If user is not authenticated and tries to access protected path
    if (!session && !isAuthPath) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Only check admin status for admin paths
    if (path.startsWith('/admindash')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/booking/:path*',
    '/admindash/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ]
}
