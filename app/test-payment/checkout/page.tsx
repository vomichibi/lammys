'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CheckoutForm from '@/components/payment/CheckoutForm'
import { toast } from 'sonner'
import { getStripe } from '@/lib/stripe'

// Initialize Stripe once
const stripePromise = getStripe()

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        console.log('Initializing checkout...')
        const itemsParam = searchParams.get('items')
        const totalParam = searchParams.get('total')

        console.log('URL Parameters:', { itemsParam, totalParam })

        if (!itemsParam || !totalParam) {
          throw new Error('Missing order details')
        }

        const items = JSON.parse(itemsParam)
        const total = parseFloat(totalParam)

        console.log('Parsed order details:', { items, total })

        if (!items.length || total <= 0) {
          throw new Error('Invalid order details')
        }

        setOrderDetails({ items, total })

        console.log('Creating payment intent...')
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, amount: total }),
        })

        console.log('Payment intent response status:', response.status)
        const data = await response.json()
        console.log('Payment intent response:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        if (!data.clientSecret) {
          throw new Error('No client secret received')
        }

        setClientSecret(data.clientSecret)
        setError(null)
      } catch (error: any) {
        console.error('Checkout initialization error:', error)
        setError(error.message || 'Failed to initialize checkout')
        toast.error(error.message || 'Failed to initialize checkout')
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p>Initializing payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="space-y-6 py-8">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => router.push('/test-payment')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Return to Test Payment
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-red-500">Unable to initialize payment. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderDetails && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="space-y-2">
                {orderDetails.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
            <CheckoutForm amount={orderDetails?.total} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  )
}
