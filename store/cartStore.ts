'use client';

import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

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
  isGuest: boolean;
  guestEmail: string | null;
  guestName: string | null;
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  syncWithSupabase: (userId: string) => Promise<void>;
  checkout: () => Promise<string>;
  completeCart: (userId: string, userEmail: string) => Promise<void>;
  setGuestInfo: (name: string, email: string) => void;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  userId: null,
  initialized: false,
  isGuest: false,
  guestEmail: null,
  guestName: null,

  setError: (error: string | null) => set({ error }),

  setGuestInfo: (name: string, email: string) => {
    set({ guestName: name, guestEmail: email, isGuest: true });
  },

  initializeCart: async (userId?: string) => {
    try {
      set({ isLoading: true });
      if (userId) {
        set({ userId });
        await get().loadFromSupabase(userId);
      } else {
        set({ isGuest: true });
      }
      set({ initialized: true });
    } catch (error) {
      set({ error: 'Failed to initialize cart' });
      console.error('Error initializing cart:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadFromSupabase: async (userId: string) => {
    try {
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      set({ items: cartItems || [] });
    } catch (error) {
      set({ error: 'Failed to load cart' });
      console.error('Error loading cart:', error);
    }
  },

  syncWithSupabase: async (userId: string) => {
    try {
      const { items } = get();
      
      // Delete existing items
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);

      // Insert new items
      if (items.length > 0) {
        const { error } = await supabase
          .from('cart_items')
          .insert(items.map(item => ({ ...item, user_id: userId })));

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error syncing with Supabase:', error);
      set({ error: 'Failed to sync cart' });
    }
  },

  addItem: async (item: CartItem) => {
    try {
      const { items, userId } = get();
      const existingItem = items.find((i) => i.id === item.id);

      if (existingItem) {
        const updatedItems = items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        set({ items: updatedItems });
      } else {
        set({ items: [...items, item] });
      }

      if (userId) {
        await get().syncWithSupabase(userId);
      }
    } catch (error) {
      set({ error: 'Failed to add item to cart' });
      console.error('Error adding item to cart:', error);
    }
  },

  removeItem: async (itemId: string) => {
    try {
      const { items, userId } = get();
      const newItems = items.filter(item => item.id !== itemId);
      set({ items: newItems });

      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId)
          .eq('id', itemId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error removing item:', error);
      set({ error: 'Failed to remove item from cart' });
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      const { items, userId } = get();
      const newItems = items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ items: newItems });

      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('user_id', userId)
          .eq('id', itemId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      set({ error: 'Failed to update item quantity' });
    }
  },

  clearCart: async () => {
    try {
      const { userId } = get();
      set({ items: [] });

      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart' });
    }
  },

  checkout: async () => {
    const { items, userId, isGuest, guestEmail, guestName } = get();
    if (!items.length) {
      throw new Error('Cart is empty');
    }

    if (!userId && (!guestEmail || !guestName)) {
      throw new Error('Guest information required');
    }

    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userId,
          isGuest,
          guestEmail,
          guestName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },

  completeCart: async (userId: string, userEmail: string) => {
    try {
      const { items } = get();
      const { error } = await supabase
        .from('completed_carts')
        .insert([
          {
            user_id: userId,
            user_email: userEmail,
            items: items,
            completed_at: new Date()
          }
        ]);

      if (error) throw error;
      await get().clearCart();
    } catch (error) {
      console.error('Error completing cart:', error);
      set({ error: 'Failed to complete cart' });
    }
  }
}));

export { useCartStore };
export type { CartItem };
