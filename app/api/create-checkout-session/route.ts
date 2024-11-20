import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const { items, userEmail } = await req.json();

    if (!items?.length) {
      return NextResponse.json(
        { error: 'Please provide items to checkout' },
        { status: 400 }
      );
    }

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: item.name,
          description: `${item.category} - Quantity: ${item.quantity}`,
        },
        unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/cart`,
      customer_email: userEmail,
      metadata: {
        userEmail,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
