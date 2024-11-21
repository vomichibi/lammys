'use client';

import { create } from 'zustand';
import { db } from '@/lib/firebaseInit';
import type { Firestore } from 'firebase/firestore';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  getDoc,
  query,
  where,
} from 'firebase/firestore';

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  category: string;
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

  setError: (error: string | null) => set({ error }),

  initializeCart: async (userId: string) => {
    if (!userId) {
      set({ error: 'Invalid user ID' });
      return;
    }
    try {
      set({ isLoading: true, userId });
      const userCartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(userCartRef);
      
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        set({ items: cartData.items || [], initialized: true });
      } else {
        await setDoc(userCartRef, { items: [] });
        set({ items: [], initialized: true });
      }
    } catch (error) {
      set({ error: 'Failed to initialize cart' });
      console.error('Error initializing cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadFromFirestore: async (userId: string) => {
    if (!userId) {
      set({ error: 'Invalid user ID' });
      return;
    }
    try {
      set({ isLoading: true });
      const userCartRef = doc(db, 'carts', userId);
      const cartDoc = await getDoc(userCartRef);
      
      if (cartDoc.exists()) {
        const cartData = cartDoc.data();
        set({ items: cartData.items || [], initialized: true });
      }
    } catch (error) {
      set({ error: 'Failed to load cart from Firestore' });
      console.error('Error loading cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  syncWithFirestore: async (userId: string) => {
    if (!userId) {
      set({ error: 'Invalid user ID' });
      return;
    }
    try {
      set({ isLoading: true });
      const { items } = get();
      const userCartRef = doc(db, 'carts', userId);
      await setDoc(userCartRef, { items }, { merge: true });
    } catch (error) {
      set({ error: 'Failed to sync cart with Firestore' });
      console.error('Error syncing cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item: CartItem) => {
    const { items, userId } = get();
    const existingItem = items.find((i) => i.id === item.id);

    if (existingItem) {
      const updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      set({ items: updatedItems });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] });
    }

    if (userId) {
      await get().syncWithFirestore(userId);
    }
  },

  removeItem: async (itemId: string) => {
    const { items, userId } = get();
    set({ items: items.filter((item) => item.id !== itemId) });
    
    if (userId) {
      await get().syncWithFirestore(userId);
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { items, userId } = get();
    if (quantity < 1) {
      await get().removeItem(itemId);
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });

    if (userId) {
      await get().syncWithFirestore(userId);
    }
  },

  clearCart: async () => {
    const { userId } = get();
    set({ items: [], initialized: false });
    
    if (userId) {
      const userCartRef = doc(db, 'carts', userId);
      await setDoc(userCartRef, { items: [] });
    }
  },

  checkout: async () => {
    const { items, userId } = get();
    if (!userId || items.length === 0) {
      throw new Error('Cannot checkout with empty cart or without user ID');
    }

    try {
      set({ isLoading: true });
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  completeCart: async (userId: string, userEmail: string) => {
    try {
      set({ isLoading: true });
      await get().clearCart();
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to complete cart' });
      throw error;
    }
  },
}));

export { useCartStore };
export type { CartItem };
