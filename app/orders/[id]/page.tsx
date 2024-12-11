'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, formatDateTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';
import { ArrowLeft, FileText, Clock, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  service_id: string;
  service_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  payment_intent: string;
  updated_at: string;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/user/orders/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading order details...</div>;
  if (error) return <div className="p-8">Error: {error}</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Order #{order.id}</CardTitle>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {formatDateTime(order.created_at)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(order.total_amount)}</div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'paid' 
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Order Items */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <div>
                    <div className="font-medium">{item.service_name}</div>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>{formatCurrency(item.price * item.quantity)}</div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        {order.payment_intent && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Payment ID: {order.payment_intent}</span>
                </div>
                <div className="flex items-center text-sm">
                  <FileText className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Last updated: {formatDateTime(order.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          {order.status === 'paid' && (
            <Button asChild>
              <Link href={`/booking?reorder=${order.id}`}>
                Book Similar Service
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
