'use client';

import { create } from 'zustand';
import { db } from '@/lib/firebaseInit';
import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  enableNetwork,
  disableNetwork,
  getDoc,
  enableIndexedDbPersistence,
} from 'firebase/firestore';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  initialized: boolean;
  userId: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reconnect: () => Promise<void>;
  syncWithFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  unsubscribe: null,
  initialized: false,
  userId: null,

  initializeCart: async (userId: string) => {
    const currentState = get();
    
    // If already initialized with the same userId, don't reinitialize
    if (currentState.initialized && currentState.userId === userId && currentState.unsubscribe) {
      return;
    }

    let currentUnsubscribe = currentState.unsubscribe;
    try {
      // Validate userId
      if (!userId || userId.trim() === '') {
        throw new Error('Invalid userId provided');
      }

      set({ isLoading: true, error: null });

      // Cleanup previous listener if exists
      if (currentUnsubscribe) {
        currentUnsubscribe();
        set({ unsubscribe: null });
      }

      // Enable persistence only once
      try {
        await enableIndexedDbPersistence(db).catch((err) => {
          if (err.code === 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time
            console.warn('Persistence already enabled in another tab');
          } else if (err.code === 'unimplemented') {
            // The current browser doesn't support persistence
            console.warn('Persistence not supported in this browser');
          }
        });
      } catch (err) {
        // Ignore persistence errors, they shouldn't stop cart initialization
        console.warn('Persistence setup failed:', err);
      }

      // Create cart reference
      const cartRef = collection(db, 'carts', userId.trim());
      
      // Set up snapshot listener
      const newUnsubscribe = onSnapshot(
        cartRef,
        (snapshot) => {
          const items: CartItem[] = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as CartItem);
          });
          set({ 
            items, 
            error: null, 
            initialized: true,
            userId: userId.trim() 
          });
        },
        (error) => {
          console.error('Cart sync error:', error);
          set({ 
            error: 'Failed to sync cart', 
            initialized: false,
            userId: null
          });
        }
      );

      set({ unsubscribe: newUnsubscribe });
    } catch (error) {
      console.error('Initialize cart error:', error);
      set({ 
        error: 'Failed to initialize cart',
        initialized: false,
        userId: null
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item: CartItem) => {
    try {
      set({ isLoading: true, error: null });
      const userId = get().userId; 
      if (!userId) throw new Error('User not authenticated');
      
      const cartRef = doc(db, 'carts', userId.trim(), item.id);
      
      const docSnap = await getDoc(cartRef);
      if (docSnap.exists()) {
        const existingItem = docSnap.data() as CartItem;
        await setDoc(cartRef, {
          ...item,
          quantity: existingItem.quantity + 1,
        });
      } else {
        await setDoc(cartRef, { ...item, quantity: 1 });
      }
    } catch (error) {
      console.error('Add item error:', error);
      set({ error: 'Failed to add item to cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId: string) => {
    try {
      set({ isLoading: true, error: null });
      const userId = get().userId; 
      if (!userId) throw new Error('User not authenticated');
      
      const cartRef = doc(db, 'carts', userId.trim(), itemId);
      await deleteDoc(cartRef);
    } catch (error) {
      console.error('Remove item error:', error);
      set({ error: 'Failed to remove item from cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      set({ isLoading: true, error: null });
      const userId = get().userId; 
      if (!userId) throw new Error('User not authenticated');
      
      const cartRef = doc(db, 'carts', userId.trim(), itemId);
      
      if (quantity > 0) {
        const docSnap = await getDoc(cartRef);
        if (docSnap.exists()) {
          await updateDoc(cartRef, { quantity });
        }
      } else {
        await deleteDoc(cartRef);
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      set({ error: 'Failed to update quantity' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const userId = get().userId; 
      if (!userId) throw new Error('User not authenticated');
      
      const promises = get().items.map((item) =>
        deleteDoc(doc(db, 'carts', userId.trim(), item.id))
      );
      await Promise.all(promises);
    } catch (error) {
      console.error('Clear cart error:', error);
      set({ error: 'Failed to clear cart' });
    } finally {
      set({ isLoading: false });
    }
  },

  reconnect: async () => {
    try {
      set({ isLoading: true, error: null });
      await enableNetwork(db);
      await get().initializeCart(get().userId as string);
    } catch (error) {
      console.error('Reconnect error:', error);
      set({ error: 'Failed to reconnect' });
    } finally {
      set({ isLoading: false });
    }
  },

  syncWithFirestore: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const items = get().items;
      const cartRef = collection(db, 'carts', userId.trim());
      
      // Get existing items
      const snapshot = await getDocs(cartRef);
      const existingItems = new Map(
        snapshot.docs.map(doc => [doc.id, doc.data() as CartItem])
      );
      
      // Update or add items
      const promises = items.map(item => {
        const docRef = doc(db, 'carts', userId.trim(), item.id);
        return setDoc(docRef, item);
      });
      
      // Remove items that are no longer in the local state
      const itemIds = new Set(items.map(item => item.id));
      existingItems.forEach((_, id) => {
        if (!itemIds.has(id)) {
          const docRef = doc(db, 'carts', userId.trim(), id);
          promises.push(deleteDoc(docRef));
        }
      });
      
      await Promise.all(promises);
    } catch (error) {
      console.error('Sync error:', error);
      set({ error: 'Failed to sync with Firestore' });
    } finally {
      set({ isLoading: false });
    }
  },

  loadFromFirestore: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });
      const cartRef = collection(db, 'carts', userId.trim());
      const snapshot = await getDocs(cartRef);
      
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CartItem[];

      set({ items, initialized: true });
    } catch (error) {
      console.error('Load from Firestore error:', error);
      set({ 
        error: 'Failed to load from Firestore',
        initialized: false
      });
    } finally {
      set({ isLoading: false });
    }
  }
}));

export { useCartStore };
export type { CartItem };
