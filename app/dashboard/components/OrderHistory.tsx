'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { formatDate } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: Array<{
    service_id: string;
    service_name: string;
    quantity: number;
    price: number;
  }>;
  payment_intent: string;
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/user/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading order history...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Order History</h2>
        <Link href="/booking">
          <Button>Book New Service</Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600">No orders found</p>
            <p className="mt-2 text-sm text-gray-500">
              Book your first service to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {formatCurrency(order.total_amount)}
                    </p>
                    <p className={`text-sm ${
                      order.status === 'paid' 
                        ? 'text-green-600' 
                        : order.status === 'pending' 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="font-medium">{item.service_name}</span>
                          <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        </div>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" asChild>
                      <Link href={`/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                    {order.status === 'paid' && (
                      <Button asChild>
                        <Link 
                          href={`/booking?reorder=${order.id}`}
                          className="inline-flex items-center"
                        >
                          Book Again
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
