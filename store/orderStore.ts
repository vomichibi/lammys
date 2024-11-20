'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebaseInit';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';

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
  createOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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
          const ordersRef = collection(db, 'orders');
          const q = query(
            ordersRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          const orders = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          })) as Order[];
          
          set({ orders });
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
          const orderId = createOrderId();
          const orderRef = doc(db, 'orders', orderId);
          
          const order: Order = {
            ...orderData,
            id: orderId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          await setDoc(orderRef, order);
          
          set(state => ({
            orders: [order, ...state.orders]
          }));
        } catch (error: any) {
          console.error('Error creating order:', error);
          set({ error: error?.message || 'Failed to create order' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateOrderStatus: async (orderId: string, status: Order['status']) => {
        try {
          set({ isLoading: true, error: null });
          const orderRef = doc(db, 'orders', orderId);
          
          await setDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          
          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId
                ? { ...order, status, updatedAt: new Date().toISOString() }
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
