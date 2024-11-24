import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../lib/firebaseInit';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const orderData = {
        items: lineItems.data.map(item => ({
          quantity: item.quantity,
          price: item.amount_total / 100, // Convert from cents to dollars
          category: (item.price?.product as Stripe.Product)?.name || 'Uncategorized'
        })),
        status: 'pending',
        total: session.amount_total ? session.amount_total / 100 : 0,
        customerEmail: session.customer_details?.email || '',
        customerName: session.customer_details?.name || '',
        createdAt: new Date(),
        paymentStatus: session.payment_status,
        paymentId: session.payment_intent as string,
      };

      // Add order to Firestore
      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);

      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }
}
