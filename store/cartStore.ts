import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  syncWithFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      setError: (error: string | null) => set({ error }),

      addItem: (item: CartItem) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      syncWithFirestore: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const cartRef = doc(db, 'carts', userId);
          const cartData = { items: get().items };
          await setDoc(cartRef, cartData, { merge: true });
        } catch (error) {
          console.error('Error syncing with Firestore:', error);
          set({ error: 'Failed to sync cart. Changes will be saved locally.' });
          // Don't throw the error - allow the app to continue with local storage
        } finally {
          set({ isLoading: false });
        }
      },

      loadFromFirestore: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const cartRef = doc(db, 'carts', userId);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            const data = cartSnap.data();
            set({ items: data.items });
          }
        } catch (error) {
          console.error('Error loading from Firestore:', error);
          set({ error: 'Failed to load cart from server. Using local data.' });
          // Don't throw the error - continue with local storage data
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      // Persist everything except isLoading and error states
      partialize: (state) => ({
        items: state.items
      }),
    }
  )
);
