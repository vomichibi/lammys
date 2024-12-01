import Stripe from 'stripe'
import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js'

if (!process.env.STRIPE_SECRET_API_KEY) {
  throw new Error('STRIPE_SECRET_API_KEY is not set in environment variables')
}

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Stripe publishable key is missing. Please check your environment variables.')
}

// Initialize Stripe with the secret key for server-side operations
export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Initialize Stripe.js for client-side operations
let stripePromise: Promise<StripeClient | null> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(PUBLISHABLE_KEY)
  }
  return stripePromise
}
