'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useOrderStore } from '@/store/orderStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';

export default function OrdersPage() {
  const { data: session } = useSession();
  const { orders, fetchUserOrders } = useOrderStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (session?.user?.email) {
        try {
          await fetchUserOrders(session.user.email);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadOrders();
  }, [session, fetchUserOrders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white rounded-lg shadow"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-4">
              You haven't placed any orders with us yet.
            </p>
            <Button
              onClick={() => window.location.href = '/booking'}
            >
              Make a Booking
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">
                      Order #{order.id.slice(-6)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDistance(new Date(order.createdAt), new Date(), { addSuffix: true })}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold ml-2">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                  {order.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
