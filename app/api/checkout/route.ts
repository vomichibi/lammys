import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    const { items, token } = await request.json()

    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError) throw authError

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'aud',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: item.price * 100, // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${origin}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cart`,
      metadata: {
        userId: user.id,
      },
    })

    // Create order in Supabase
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        session_id: session.id,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        status: 'pending',
        items: items,
      })

    if (orderError) throw orderError

    return NextResponse.json({ sessionId: session.id })
  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    )
  }
}
