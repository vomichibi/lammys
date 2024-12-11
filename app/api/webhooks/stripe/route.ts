import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any

      // Update order status in Supabase
      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', payment_intent: session.payment_intent })
        .eq('session_id', session.id)

      if (orderError) {
        console.error('Error updating order status:', orderError)
        return NextResponse.json(
          { error: 'Failed to update order status' },
          { status: 500 }
        )
      }

      // You could send confirmation emails here
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
