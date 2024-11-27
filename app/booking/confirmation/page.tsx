'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function BookingConfirmation() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { items, completeCart } = useCartStore();
  const { createOrder } = useOrderStore();

  useEffect(() => {
    const handleOrderCompletion = async () => {
      if (!loading && user?.email && items.length > 0) {
        try {
          // Calculate total with proper type handling
          const total = items.reduce<number>(
            (sum, item) => {
              const itemPrice = typeof item.price === 'string' 
                ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
                : item.price;
              return sum + (itemPrice * item.quantity);
            },
            0
          );

          // Convert cart items to order items with correct price type
          const orderItems: OrderItem[] = items.map((item) => ({
            id: item.id,
            name: item.name,
            price: typeof item.price === 'string' 
              ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
              : item.price,
            quantity: item.quantity,
            category: item.category
          }));

          // Create the order
          await createOrder({
            userId: user.email,
            userEmail: user.email,
            items: orderItems,
            status: 'pending',
            total: parseFloat(total.toFixed(2)) // Ensure total is a number with 2 decimal places
          });

          // Complete the cart
          await completeCart(user.email, user.email);
        } catch (error) {
          console.error('Error completing order:', error);
        }
      }
    };

    handleOrderCompletion();
  }, [loading, user, items, createOrder, completeCart]);

  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : price;
    return numericPrice.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
              aria-hidden="true"
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
                    <span>${formatPrice(item.price)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>
                      ${formatPrice(items.reduce<number>((sum, item) => {
                        const itemPrice = typeof item.price === 'string'
                          ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                          : item.price;
                        return sum + (itemPrice * item.quantity);
                      }, 0))}
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
