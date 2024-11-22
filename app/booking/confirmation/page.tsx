'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function BookingConfirmation() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, completeCart } = useCartStore();
  const { createOrder } = useOrderStore();

  useEffect(() => {
    const handleOrderCompletion = async () => {
      if (session?.user?.email && items.length > 0) {
        try {
          // Calculate total
          const total = items.reduce(
            (sum: number, item) => {
              const price = typeof item.price === 'string' 
                ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
                : item.price;
              return sum + price * item.quantity;
            },
            0
          );

          // Convert cart items to order items with correct price type
          const orderItems = items.map(item => ({
            ...item,
            price: typeof item.price === 'string' 
              ? parseFloat(item.price.toString().replace(/[^0-9.]/g, ''))
              : item.price
          }));

          // Create the order
          await createOrder({
            userId: session.user.email,
            userEmail: session.user.email,
            items: orderItems,
            status: 'pending',
            total: total
          });

          // Complete the cart
          await completeCart(session.user.email, session.user.email);
        } catch (error) {
          console.error('Error completing order:', error);
        }
      }
    };

    handleOrderCompletion();
  }, [session, items, createOrder, completeCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for choosing Lammy's Dry Cleaning. We have received your booking
            and will send you a confirmation email shortly.
          </p>
          
          {items.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ${items.reduce((sum: number, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Link 
            href="/orders"
            className="block w-full"
          >
            <Button
              variant="default"
              className="w-full"
            >
              View Your Orders
            </Button>
          </Link>
          
          <Link 
            href="/contact"
            className="block w-full"
          >
            <Button
              variant="outline"
              className="w-full"
            >
              Contact Support
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
