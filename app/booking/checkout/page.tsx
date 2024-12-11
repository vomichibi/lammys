'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { items, isLoading: cartLoading, initializeCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleCheckout = async () => {
    if (!user?.email) {
      setError('Please log in to checkout');
      return;
    }

    if (!items.length) {
      setError('Your cart is empty');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

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
      setIsProcessing(false);
    }
  };

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

            <Button
              onClick={handleCheckout}
              disabled={isProcessing || items.length === 0}
              className="w-full mt-6"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </div>
              ) : (
                'Proceed to Payment'
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
