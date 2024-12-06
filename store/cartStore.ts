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
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loadFromSupabase: (userId: string) => Promise<void>;
  syncWithSupabase: (userId: string) => Promise<void>;
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
    try {
      set({ isLoading: true, userId });
      await get().loadFromSupabase(userId);
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
      const newItems = [...items, item];
      set({ items: newItems });
      
      if (userId) {
        const { error } = await supabase
          .from('cart_items')
          .insert([{ ...item, user_id: userId }]);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error adding item:', error);
      set({ error: 'Failed to add item to cart' });
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
    try {
      const { items, userId } = get();
      if (!userId) throw new Error('User not authenticated');

      // Create order in Supabase
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            items: items,
            status: 'pending',
            total: items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
          }
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Clear cart after successful checkout
      await get().clearCart();

      return order.id;
    } catch (error) {
      console.error('Error during checkout:', error);
      set({ error: 'Failed to process checkout' });
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
