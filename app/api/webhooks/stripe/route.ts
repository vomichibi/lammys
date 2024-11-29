import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/firebase-admin'
import { stripe } from '@/lib/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new NextResponse('Webhook signature verification failed', { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session

    if (event.type === 'checkout.session.completed') {
      const customerId = session.client_reference_id // This should be the Firebase UID
      
      if (!customerId) {
        console.error('No customer ID found in session')
        return new NextResponse('No customer ID found', { status: 400 })
      }

      // Update order status in Firestore
      const orderRef = db.collection('orders').doc(session.id)
      await orderRef.update({
        status: 'paid',
        stripePaymentId: session.payment_intent as string,
        updatedAt: new Date().toISOString()
      })

      // Update user's orders in Firestore
      const userRef = db.collection('users').doc(customerId)
      await userRef.update({
        orders: db.FieldValue.arrayUnion(session.id)
      })

      console.log(`Payment successful for order ${session.id}`)
    }

    return new NextResponse('Webhook processed successfully', { status: 200 })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new NextResponse('Webhook error', { status: 500 })
  }
}
