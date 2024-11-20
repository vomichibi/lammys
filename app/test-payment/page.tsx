'use client'

import { useState, useEffect } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import CheckoutForm from '@/components/payment/CheckoutForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const testServices = [
  { id: 1, name: 'Dry Cleaning - Shirt', price: 5.99 },
  { id: 2, name: 'Dry Cleaning - Pants', price: 7.99 },
  { id: 3, name: 'Dry Cleaning - Suit', price: 15.99 },
]

export default function TestPaymentPage() {
  const [clientSecret, setClientSecret] = useState('')
  const [selectedServices, setSelectedServices] = useState<typeof testServices>([])

  const total = selectedServices.reduce((sum, service) => sum + service.price, 0)

  useEffect(() => {
    if (total > 0) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items: selectedServices,
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
    }
  }, [total])

  const toggleService = (service: typeof testServices[0]) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Test Payment - Dry Cleaning Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {testServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">${service.price}</p>
                </div>
                <button
                  onClick={() => toggleService(service)}
                  className={`px-4 py-2 rounded-md ${
                    selectedServices.find((s) => s.id === service.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {selectedServices.find((s) => s.id === service.id)
                    ? 'Selected'
                    : 'Select'}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-lg font-medium">
              Total: ${total.toFixed(2)}
            </p>
          </div>

          {clientSecret && (
            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                },
              }}
            >
              <CheckoutForm amount={total} />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
