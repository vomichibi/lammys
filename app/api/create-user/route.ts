import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const decodedToken = await auth.verifyIdToken(token)
    
    // Create user document in Firestore
    await db.collection('users').doc(decodedToken.uid).set({
      email: decodedToken.email,
      createdAt: new Date().toISOString(),
      role: 'user'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
