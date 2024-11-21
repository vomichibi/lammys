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
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
  syncWithFirestore: (userId: string) => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  userId: null,

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
        set({ items: cartData.items || [] });
      } else {
        await setDoc(userCartRef, { items: [] });
        set({ items: [] });
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
        set({ items: cartData.items || [] });
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
      const { items } = get();
      const userCartRef = doc(db, 'carts', userId);
      await setDoc(userCartRef, { items }, { merge: true });
    } catch (error) {
      set({ error: 'Failed to sync cart with Firestore' });
      console.error('Error syncing cart:', error);
    }
  },

  addItem: async (item: CartItem) => {
    const { items, userId } = get();
    const existingItem = items.find(i => i.id === item.id);

    if (existingItem) {
      const updatedItems = items.map(i =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
      set({ items: updatedItems });
    } else {
      set({ items: [...items, { ...item, quantity: 1 }] });
    }

    if (userId) {
      try {
        await get().syncWithFirestore(userId);
      } catch (error) {
        console.error('Error syncing after add:', error);
      }
    }
  },

  removeItem: async (itemId: string) => {
    const { items, userId } = get();
    const updatedItems = items.filter(item => item.id !== itemId);
    set({ items: updatedItems });

    if (userId) {
      try {
        await get().syncWithFirestore(userId);
      } catch (error) {
        console.error('Error syncing after remove:', error);
      }
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { items, userId } = get();
    if (quantity < 1) return;

    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, quantity }
        : item
    );
    set({ items: updatedItems });

    if (userId) {
      try {
        await get().syncWithFirestore(userId);
      } catch (error) {
        console.error('Error syncing after update:', error);
      }
    }
  },

  clearCart: async () => {
    const { userId } = get();
    set({ items: [] });

    if (userId) {
      try {
        await get().syncWithFirestore(userId);
      } catch (error) {
        console.error('Error syncing after clear:', error);
      }
    }
  },
}));

export { useCartStore };
export type { CartItem };
