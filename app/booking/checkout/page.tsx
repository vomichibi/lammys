'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import CheckoutForm from '@/components/payment/CheckoutForm';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { items, isLoading: cartLoading, initializeCart } = useCartStore();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum: number, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
      : item.price;
    return sum + (price * item.quantity);
  }, 0);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Initialize cart when user is available
    if (user.email) {
      initializeCart(user.email).catch((error) => {
        console.error('Failed to initialize cart:', error);
        setError('Failed to load cart data');
      });
    }
  }, [user, router, initializeCart]);

  useEffect(() => {
    if (!user?.email || !items.length) return;

    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        items,
        userEmail: user.email 
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        console.error('Error creating payment intent:', err);
        setError('Failed to initialize payment. Please try again.');
      });
  }, [items, user?.email]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {cartLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div>
            {items.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-medium">${Number(item.price) * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {clientSecret && (
              <div className="mt-6">
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0070f3',
                      },
                    },
                  }}
                >
                  <CheckoutForm amount={total} />
                </Elements>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
