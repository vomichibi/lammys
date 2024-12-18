'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

const testServices = [
  { id: 1, name: 'Dry Cleaning - Shirt', price: 5.99 },
  { id: 2, name: 'Dry Cleaning - Pants', price: 7.99 },
  { id: 3, name: 'Dry Cleaning - Suit', price: 15.99 },
]

export default function TestPaymentPage() {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<typeof testServices>([])
  const [loading, setLoading] = useState(false)

  const total = selectedServices.reduce((sum: number, service) => sum + service.price, 0)

  const handleCheckout = () => {
    if (selectedServices.length === 0) {
      toast.error('Please select at least one service')
      return
    }

    try {
      setLoading(true)
      console.log('Selected services:', selectedServices)
      console.log('Total amount:', total)

      const searchParams = new URLSearchParams()
      const itemsJson = JSON.stringify(selectedServices)
      searchParams.set('items', itemsJson)
      searchParams.set('total', total.toString())

      console.log('URL parameters:', {
        items: itemsJson,
        total: total.toString()
      })

      const checkoutUrl = `/test-payment/checkout?${searchParams.toString()}`
      console.log('Navigating to:', checkoutUrl)
      
      router.push(checkoutUrl)
    } catch (error) {
      console.error('Navigation error:', error)
      toast.error('Failed to proceed to checkout')
      setLoading(false)
    }
  }

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
            <p className="text-lg font-medium mb-4">
              Total: ${total.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              disabled={loading || selectedServices.length === 0}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
