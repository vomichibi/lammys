import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const handleSuccessfulPayment = async (session: Stripe.Checkout.Session) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: session.client_reference_id,
        userEmail: session.customer_email,
        items: session.line_items?.data.map(item => ({
          id: item.id,
          name: item.description,
          quantity: item.quantity,
          price: item.amount_total / 100, // Convert from cents to dollars
          category: item.price?.product?.name || 'Uncategorized'
        })),
        status: 'pending',
        total: session.amount_total ? session.amount_total / 100 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to store order analytics');
    }

    console.log('Successfully stored order analytics');
  } catch (error) {
    console.error('Error storing order analytics:', error);
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
