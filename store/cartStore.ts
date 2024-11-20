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
      const cartRef = collection(db as Firestore, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const cartData = cartDoc.data();
        set({ items: cartData.items || [] });
      } else {
        // Create a new cart for the user
        const newCart = {
          userId,
          items: []
        };
        const newCartRef = doc(collection(db as Firestore, 'carts'));
        await setDoc(newCartRef, newCart);
        set({ items: [] });
      }
      set({ error: null });
    } catch (error) {
      console.error('Failed to initialize cart:', error);
      set({ error: 'Failed to load cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item: CartItem) => {
    const { userId, items } = get();
    if (!userId) return;

    try {
      set({ isLoading: true });
      const cartRef = collection(db as Firestore, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const updatedItems = [...items, item];
        await updateDoc(cartDoc.ref, { items: updatedItems });
        set({ items: updatedItems });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      set({ error: 'Failed to add item to cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    const { userId, items } = get();
    if (!userId) return;

    try {
      set({ isLoading: true });
      const cartRef = collection(db as Firestore, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const updatedItems = items.filter(item => item.id !== itemId);
        await updateDoc(cartDoc.ref, { items: updatedItems });
        set({ items: updatedItems });
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      set({ error: 'Failed to remove item from cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const { userId, items } = get();
    if (!userId) return;

    try {
      set({ isLoading: true });
      const cartRef = collection(db as Firestore, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        await updateDoc(cartDoc.ref, { items: updatedItems });
        set({ items: updatedItems });
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      set({ error: 'Failed to update item quantity' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    const { userId } = get();
    if (!userId) return;

    try {
      set({ isLoading: true });
      const cartRef = collection(db as Firestore, 'carts');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const cartDoc = querySnapshot.docs[0];
        await updateDoc(cartDoc.ref, { items: [] });
        set({ items: [] });
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      set({ error: 'Failed to clear cart' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { useCartStore };
export type { CartItem };
