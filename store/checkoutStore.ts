'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import { getStripe } from '@/lib/stripe'
import type { Service } from '@/types/auth'

interface CartItem {
  service: Service
  quantity: number
}

interface CheckoutStore {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addItem: (service: Service, quantity?: number) => void
  removeItem: (serviceId: string) => void
  updateQuantity: (serviceId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  checkout: () => Promise<{ sessionId: string } | undefined>
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: (service: Service, quantity = 1) => {
        set(state => {
          const existingItem = state.items.find(
            item => item.service.id === service.id
          )

          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.service.id === service.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { service, quantity }],
          }
        })
      },

      removeItem: (serviceId: string) => {
        set(state => ({
          items: state.items.filter(item => item.service.id !== serviceId),
        }))
      },

      updateQuantity: (serviceId: string, quantity: number) => {
        if (quantity < 1) return

        set(state => ({
          items: state.items.map(item =>
            item.service.id === serviceId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.service.price * item.quantity,
          0
        )
      },

      checkout: async () => {
        try {
          set({ isLoading: true, error: null })

          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Please sign in to checkout')

          const items = get().items
          if (items.length === 0) throw new Error('Cart is empty')

          // Create order in Supabase first
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              status: 'pending',
              total_amount: get().getTotal(),
            })
            .select()
            .single()

          if (orderError) throw orderError

          // Create order items
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              items.map(item => ({
                order_id: order.id,
                service_id: item.service.id,
                quantity: item.quantity,
                price: item.service.price,
              }))
            )

          if (itemsError) throw itemsError

          // Create Stripe checkout session
          const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: items.map(item => ({
                price_data: {
                  currency: 'aud',
                  product_data: {
                    name: item.service.name,
                    description: item.service.description,
                  },
                  unit_amount: Math.round(item.service.price * 100), // Convert to cents
                },
                quantity: item.quantity,
              })),
              orderId: order.id,
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to create checkout session')
          }

          const { sessionId } = await response.json()

          // Update order with session ID
          const { error: updateError } = await supabase
            .from('orders')
            .update({ session_id: sessionId })
            .eq('id', order.id)

          if (updateError) throw updateError

          // Redirect to Stripe checkout
          const stripe = await getStripe()
          if (!stripe) throw new Error('Failed to load Stripe')

          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId,
          })

          if (stripeError) throw stripeError

          // Clear cart after successful checkout initiation
          get().clearCart()

          return { sessionId }
        } catch (error: any) {
          console.error('Checkout error:', error)
          set({ error: error?.message || 'Failed to process checkout' })
          return undefined
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'checkout-storage',
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
)
