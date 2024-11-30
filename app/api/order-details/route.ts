import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { auth } from '@/lib/firebaseAdmin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, authToken } = body

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify Firebase auth token
    const decodedToken = await auth.verifyIdToken(authToken)
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 })
    }

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Verify the user matches the session
    if (session.metadata?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
    }

    // Get payment intent details
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string)

    // Format the order details
    const orderDetails = {
      orderId: session.id,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars
      status: paymentIntent.status,
      customerEmail: session.customer_email,
      paymentMethod: paymentIntent.payment_method_types[0],
      created: new Date(session.created * 1000).toISOString(),
    }

    return NextResponse.json(orderDetails)
  } catch (error) {
    console.error('Order details error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decodedToken = await auth.verifyIdToken(token)
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'No session ID provided' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.metadata?.userId !== decodedToken.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Get order details error:', error)
    return NextResponse.json({ error: 'Failed to get order details' }, { status: 500 })
  }
}
