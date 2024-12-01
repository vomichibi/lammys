import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

if (!process.env.STRIPE_SECRET_API_KEY) {
  throw new Error('STRIPE_SECRET_API_KEY is not set in environment variables')
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY is not set in environment variables')
}

// Initialize Stripe with the secret key for server-side operations
export const stripe = new Stripe(process.env.STRIPE_SECRET_API_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

// Initialize Stripe.js for client-side operations
let stripePromise: Promise<any> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY;
    if (!key) {
      throw new Error('Stripe publishable key is not available');
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}
