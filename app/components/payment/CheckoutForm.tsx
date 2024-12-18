'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CheckoutFormProps {
  amount?: number
}

export default function CheckoutForm({ amount }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe has not been properly initialized')
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/test-payment/success`,
        },
      })

      if (submitError) {
        setError(submitError.message || 'Payment failed')
        toast.error(submitError.message || 'Payment failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      const errorMessage = error?.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-500 rounded-lg text-sm">
          {error}
        </div>
      )}
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : amount ? `Pay $${amount.toFixed(2)}` : 'Pay Now'}
      </Button>
    </form>
  )
}
