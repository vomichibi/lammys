import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token)
    
    // Check if user has admin custom claim
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
    }

    return NextResponse.json({ isAdmin: true })
  } catch (error) {
    console.error('Admin check error:', error)
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }
}
