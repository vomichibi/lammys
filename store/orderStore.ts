'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/types/auth'

interface OrderStore {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchUserOrders: () => Promise<void>
  createOrder: (
    items: Array<{ service_id: string; quantity: number; price: number }>,
    total_amount: number
  ) => Promise<Order>
  updateOrderStatus: (orderId: string, status: string) => Promise<void>
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchUserOrders: async () => {
        try {
          set({ isLoading: true, error: null })

          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('No user found')

          const { data: orders, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                services (
                  name,
                  description,
                  category
                )
              )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error
          set({ orders: orders || [] })
        } catch (error: any) {
          console.error('Error fetching orders:', error)
          set({ error: error?.message || 'Failed to fetch orders' })
        } finally {
          set({ isLoading: false })
        }
      },

      createOrder: async (items, total_amount) => {
        try {
          set({ isLoading: true, error: null })

          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('No user found')

          // Create the order first
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              total_amount,
              status: 'pending'
            })
            .select()
            .single()

          if (orderError) throw orderError

          // Then create the order items
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(
              items.map(item => ({
                order_id: order.id,
                ...item
              }))
            )

          if (itemsError) throw itemsError

          // Fetch the complete order with items
          const { data: completeOrder, error: fetchError } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                services (
                  name,
                  description,
                  category
                )
              )
            `)
            .eq('id', order.id)
            .single()

          if (fetchError) throw fetchError

          set(state => ({
            orders: [completeOrder, ...state.orders]
          }))

          return completeOrder
        } catch (error: any) {
          console.error('Error creating order:', error)
          set({ error: error?.message || 'Failed to create order' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      updateOrderStatus: async (orderId: string, status: string) => {
        try {
          set({ isLoading: true, error: null })

          const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId)

          if (error) throw error

          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId ? { ...order, status } : order
            )
          }))
        } catch (error: any) {
          console.error('Error updating order status:', error)
          set({ error: error?.message || 'Failed to update order status' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        // Only persist the orders array
        orders: state.orders
      })
    }
  )
)
