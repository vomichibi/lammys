'use client';

import { create } from 'zustand';
import { db } from '@/src/firebase';
import type { CartData } from '@/src/firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  service: string;
  category?: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  initialized: boolean;
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
  syncWithFirestore: (userId: string) => Promise<void>;
  checkout: () => Promise<string>;
  completeCart: (userId: string, userEmail: string) => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  userId: null,
  initialized: false,

  setError: (error) => set({ error }),

  initializeCart: async (userId) => {
    set({ isLoading: true, userId });
    try {
      await get().loadFromFirestore(userId);
      set({ initialized: true });
    } catch (error) {
      set({ error: 'Failed to initialize cart' });
      console.error('Error initializing cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadFromFirestore: async (userId) => {
    try {
      const cartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(cartRef);
      
      if (cartDoc.exists()) {
        const cartData = cartDoc.data() as CartData;
        set({ items: cartData.items || [] });
      } else {
        await setDoc(cartRef, { items: [], updatedAt: serverTimestamp() });
        set({ items: [] });
      }
    } catch (error) {
      set({ error: 'Failed to load cart' });
      console.error('Error loading cart:', error);
    }
  },

  syncWithFirestore: async (userId) => {
    if (!userId) return;
    try {
      const { items } = get();
      const cartRef = doc(db, 'carts', userId);
      await setDoc(cartRef, {
        items,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      set({ error: 'Failed to sync cart' });
      console.error('Error syncing cart:', error);
    }
  },

  addItem: async (item) => {
    const { items, userId } = get();
    const existingItem = items.find(i => i.id === item.id);
    
    let newItems;
    if (existingItem) {
      newItems = items.map(i => 
        i.id === item.id 
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newItems = [...items, item];
    }
    
    set({ items: newItems });
    if (userId) await get().syncWithFirestore(userId);
  },

  removeItem: async (itemId) => {
    const { items, userId } = get();
    const newItems = items.filter(item => item.id !== itemId);
    set({ items: newItems });
    if (userId) await get().syncWithFirestore(userId);
  },

  updateQuantity: async (itemId, quantity) => {
    const { items, userId } = get();
    if (quantity < 1) return;

    const newItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    
    set({ items: newItems });
    if (userId) await get().syncWithFirestore(userId);
  },

  clearCart: async () => {
    const { userId } = get();
    set({ items: [] });
    if (userId) {
      try {
        await setDoc(doc(db, 'carts', userId), {
          items: [],
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        set({ error: 'Failed to clear cart' });
        console.error('Error clearing cart:', error);
      }
    }
  },

  checkout: async () => {
    const { items, userId } = get();
    if (!userId) throw new Error('User not authenticated');
    if (items.length === 0) throw new Error('Cart is empty');

    try {
      const orderRef = doc(collection(db, 'orders'));
      const order = {
        userId,
        items,
        status: 'pending',
        total: items.reduce((sum, item) => {
          const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
          return sum + price * item.quantity;
        }, 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(orderRef, order);
      await get().clearCart();
      return orderRef.id;
    } catch (error) {
      set({ error: 'Checkout failed' });
      console.error('Error during checkout:', error);
      throw error;
    }
  },

  completeCart: async (userId, userEmail) => {
    const { items } = get();
    if (items.length === 0) return;

    try {
      const orderRef = doc(collection(db, 'orders'));
      await setDoc(orderRef, {
        userId,
        userEmail,
        items,
        status: 'completed',
        createdAt: serverTimestamp(),
      });
      await get().clearCart();
    } catch (error) {
      set({ error: 'Failed to complete cart' });
      console.error('Error completing cart:', error);
    }
  },
}));

export { useCartStore };
export type { CartItem };
