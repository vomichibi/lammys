import { NextRequest, NextResponse } from 'next/server'
import { auth, db } from '@/lib/firebaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    // Verify Firebase auth token
    const decodedToken = await auth.verifyIdToken(token)
    if (!decodedToken.email) {
      return NextResponse.json({ error: 'User email not found' }, { status: 400 })
    }

    // Check if user document already exists
    const userDoc = await db.collection('users').doc(decodedToken.uid).get()
    if (userDoc.exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }
    
    // Create user document in Firestore
    await db.collection('users').doc(decodedToken.uid).set({
      email: decodedToken.email,
      createdAt: new Date().toISOString(),
      role: 'user',
      uid: decodedToken.uid
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
