'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCartStore } from '@/store/cartStore';
import { loadStripe } from '@stripe/stripe-js';
import { formatDate } from '@/lib/utils/date';

const auth = getAuth();
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { items, clearCart, isLoading: cartLoading, initializeCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const userId = user.uid;
      initializeCart(userId).catch((error) => {
        console.error('Failed to initialize cart:', error);
        setError('Failed to load cart data');
      });
    }
  }, [user, initializeCart]);

  const handleCheckout = async () => {
    if (!user) {
      setError('Please log in to checkout');
      return;
    }

    if (!items.length) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          userEmail: user.email 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });

      if (stripeError) {
        throw new Error(stripeError.message || 'Failed to redirect to checkout');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {cartLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin" />
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
                    <p className="font-medium">£{Number(item.price) * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>£{items.reduce((total: number, item) => total + (Number(item.price) * item.quantity), 0)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="w-full mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
