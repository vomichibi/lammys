import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/firebaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { sessionId, authToken } = await request.json()

    if (!authToken || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Verify Firebase auth token
    try {
      const decodedToken = await auth.verifyIdToken(authToken)
      
      // Retrieve the Stripe session
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }

      // Verify the user matches the session
      if (session.metadata?.userId !== decodedToken.uid) {
        return NextResponse.json(
          { error: 'Unauthorized access to session' },
          { status: 403 }
        )
      }

      // Get line items
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId)

      return NextResponse.json({
        session,
        lineItems: lineItems.data
      })
    } catch (verifyError) {
      console.error('Token verification error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid auth token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Order details error:', error)
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to retrieve order details' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authToken = request.headers.get('Authorization')?.split('Bearer ')[1]
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'No auth token provided' },
        { status: 401 }
      )
    }

    // Verify Firebase auth token
    try {
      const decodedToken = await auth.verifyIdToken(authToken)
      
      // List all sessions for the user
      const sessions = await stripe.checkout.sessions.list({
        limit: 10,
        expand: ['data.line_items'],
      })

      // Filter sessions for this user
      const userSessions = sessions.data.filter(
        session => session.metadata?.userId === decodedToken.uid
      )

      return NextResponse.json({ sessions: userSessions })
    } catch (verifyError) {
      console.error('Token verification error:', verifyError)
      return NextResponse.json(
        { error: 'Invalid auth token' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('List orders error:', error)
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to list orders' },
      { status: 500 }
    )
  }
}
