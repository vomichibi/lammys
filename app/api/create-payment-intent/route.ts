import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

if (!process.env.STRIPE_SECRET_API_KEY) {
  throw new Error('STRIPE_SECRET_API_KEY is not set in environment variables')
}

export async function POST(req: Request) {
  try {
    console.log('Received payment intent request')
    const { amount, items } = await req.json()
    
    console.log('Request data:', { amount, items })

    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount)
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Create a payment intent
    console.log('Creating payment intent for amount:', amount)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'aud',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(items),
      },
      description: 'Test Payment for Dry Cleaning Services',
    })

    console.log('Payment intent created successfully')
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: 'aud'
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    })
    return NextResponse.json(
      { error: 'Error creating payment intent: ' + error.message },
      { status: 500 }
    )
  }
}
