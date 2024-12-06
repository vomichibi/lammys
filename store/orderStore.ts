'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabaseClient';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: OrderItem[];
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchUserOrders: (userId: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const createOrderId = () => {
  return `ORD${Date.now()}${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchUserOrders: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data: orders, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ orders: orders || [] });
        } catch (error: any) {
          console.error('Error fetching orders:', error);
          set({ error: error?.message || 'Failed to fetch orders' });
        } finally {
          set({ isLoading: false });
        }
      },

      createOrder: async (orderData) => {
        try {
          set({ isLoading: true, error: null });
          const { data: order, error } = await supabase
            .from('orders')
            .insert([{
              ...orderData,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }])
            .select()
            .single();

          if (error) throw error;
          set(state => ({
            orders: [order, ...state.orders]
          }));
          return order;
        } catch (error: any) {
          console.error('Error creating order:', error);
          set({ error: error?.message || 'Failed to create order' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateOrderStatus: async (orderId: string, status: Order['status']) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('orders')
            .update({
              status,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId);

          if (error) throw error;

          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId
                ? { ...order, status, updated_at: new Date().toISOString() }
                : order
            )
          }));
        } catch (error: any) {
          console.error('Error updating order:', error);
          set({ error: error?.message || 'Failed to update order' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders
      }),
    }
  )
);
