import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

    // If non-admin trying to access admin dashboard
    if (session?.user.email !== 'team@lammys.au' && path.startsWith('/admindash')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admindash/:path*',
  ],
}
