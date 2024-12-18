'use client'

import { useEffect, useState } from 'react'
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()

  useEffect(() => {
    if (!stripe) {
      console.log('Stripe.js has not loaded yet.')
      return
    }
  }, [stripe])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet.')
      return
    }

    setIsProcessing(true)
    setErrorMessage(undefined)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
        toast.error(error.message || 'Payment failed')
        console.error('Payment error:', error)
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setErrorMessage(error.message || 'An unexpected error occurred')
      toast.error(error.message || 'Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="rounded-md border p-4 bg-white">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">
          {errorMessage}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : amount ? `Pay $${amount.toFixed(2)}` : 'Pay'}
      </Button>
    </form>
  )
}
