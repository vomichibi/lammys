import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/firebase-admin'
import { db } from '@/lib/firebase-admin'

export async function POST(request: NextRequest) {
  try {
    const { uid, email, name } = await request.json()

    if (!uid || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user document in Firestore
    await db.collection('users').doc(uid).set({
      email,
      name,
      role: 'customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Set custom claims for role-based access
    await auth.setCustomUserClaims(uid, { role: 'customer' })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
