'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmationPage() {
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          setError('No session ID found')
          setLoading(false)
          return
        }

        if (!user) {
          setError('Please sign in to view order details')
          setLoading(false)
          return
        }

        const response = await fetch('/api/order-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            authToken: await user.getIdToken(),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch order details')
        }

        const data = await response.json()
        setOrderDetails(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary/10 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Order Confirmed!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Thank you for your order. We'll email you the details shortly.
          </p>
        </div>

        {orderDetails && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
              <div className="mt-4 border-t border-gray-200 pt-4">
                <dl className="space-y-4">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Order ID</dt>
                    <dd className="text-sm text-gray-900">{orderDetails.orderId}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Total Amount</dt>
                    <dd className="text-sm text-gray-900">${orderDetails.amount.toFixed(2)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-600">Status</dt>
                    <dd className="text-sm text-green-600">Paid</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">What's Next?</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• We'll process your order within 24 hours</li>
                <li>• You'll receive an email with tracking information</li>
                <li>• Your items will be ready for pickup in 2-3 business days</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
