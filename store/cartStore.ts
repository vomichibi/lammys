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
  unsubscribe: (() => void) | null;
  initialized: boolean;
  userId: string | null;
  setError: (error: string | null) => void;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  initializeCart: (userId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reconnect: () => Promise<void>;
  syncWithFirestore: (userId: string) => Promise<void>;
  loadFromFirestore: (userId: string) => Promise<void>;
  checkout: () => Promise<string>;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  unsubscribe: null,
  initialized: false,
  userId: null,

  setError: (error: string | null) => set({ error }),

  initializeCart: async (userId: string) => {
    try {
      // Validate and sanitize userId
      if (!userId || userId.trim() === '') {
        throw new Error('Invalid userId provided');
      }

      const currentState = get();
      // Sanitize userId by replacing invalid characters with underscores
      const sanitizedUserId = userId.trim().replace(/[.#$[\]]/g, '_');
      
      // If already initialized with the same userId, don't reinitialize
      if (currentState.initialized && currentState.userId === sanitizedUserId) {
        return;
      }

      set({ isLoading: true, error: null });

      // Cleanup previous listener if exists
      if (currentState.unsubscribe) {
        currentState.unsubscribe();
      }

      // Create cart reference with sanitized userId
      const cartRef = collection(db, 'users', sanitizedUserId, 'cart');

      // Set up snapshot listener with error handling and retry logic
      let retryCount = 0;
      const maxRetries = 3;
      
      const setupListener = async () => {
        try {
          // Enable persistence only if not already enabled
          try {
            await enableIndexedDbPersistence(db).catch((err) => {
              if (err.code === 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled in one tab at a time
                console.info('Persistence already enabled in another tab');
              } else if (err.code === 'unimplemented') {
                // The current browser doesn't support persistence
                console.info('Persistence not supported in this browser');
              } else {
                throw err;
              }
            });
          } catch (err) {
            console.warn('Persistence setup warning:', err);
            // Continue execution - persistence is optional
          }

          const unsubscribe = onSnapshot(
            query(cartRef),
            (snapshot) => {
              const items: CartItem[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data() as CartItem;
                items.push({ ...data, id: doc.id });
              });
              set({ 
                items, 
                isLoading: false, 
                error: null, 
                initialized: true, 
                userId: sanitizedUserId 
              });
            },
            async (error) => {
              console.error('Cart sync error:', error);
              
              // If it's an IndexedDB error and we haven't exceeded retries, try again
              if (error.code === 'unavailable' && retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying cart initialization (attempt ${retryCount}/${maxRetries})...`);
                
                // Clean up the current listener
                if (currentState.unsubscribe) {
                  currentState.unsubscribe();
                }
                
                // Wait a bit before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Try again
                await setupListener();
              } else {
                set({ 
                  error: 'Failed to sync with cart', 
                  isLoading: false,
                  initialized: false,
                  userId: null
                });
              }
            }
          );

          set({ unsubscribe });
        } catch (error) {
          throw error;
        }
      };

      await setupListener();
    } catch (error) {
      console.error('Cart initialization error:', error);
      set({
        error: 'Failed to initialize cart',
        isLoading: false,
        initialized: false,
        userId: null
      });
      throw error;
    }
  },

  loadFromFirestore: async (userId: string) => {
    if (!userId) {
      set({ error: 'Invalid user ID' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      
      // Use sanitized userId
      const sanitizedUserId = userId.trim().replace(/[.#$[\]]/g, '_');
      const cartRef = collection(db, 'users', sanitizedUserId, 'cart');
      
      const snapshot = await getDocs(cartRef);
      
      const items: CartItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as CartItem;
        items.push({ ...data, id: doc.id });
      });

      set({ items, isLoading: false, error: null });
    } catch (error) {
      console.error('Error loading cart:', error);
      set({ error: 'Failed to load cart data', isLoading: false });
      throw error;
    }
  },

  addItem: async (item: CartItem) => {
    const state = get();
    if (!state.initialized || !state.userId) {
      set({ error: 'Cart not initialized' });
      throw new Error('Cart not initialized');
    }

    try {
      set({ isLoading: true, error: null });

      const sanitizedUserId = state.userId.replace(/[.#$[\]]/g, '_');
      const cartRef = collection(db, 'users', sanitizedUserId, 'cart');
      const docRef = doc(cartRef);

      await setDoc(docRef, {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      });

      set({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      set({ error: 'Failed to add item to cart', isLoading: false });
      throw error;
    }
  },

  removeItem: async (itemId: string) => {
    const state = get();
    if (!state.initialized || !state.userId) {
      set({ error: 'Cart not initialized' });
      throw new Error('Cart not initialized');
    }

    try {
      set({ isLoading: true, error: null });

      const sanitizedUserId = state.userId.replace(/[.#$[\]]/g, '_');
      const itemRef = doc(db, 'users', sanitizedUserId, 'cart', itemId);
      await deleteDoc(itemRef);

      set({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      set({ error: 'Failed to remove item from cart', isLoading: false });
      throw error;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const state = get();
    if (!state.initialized || !state.userId) {
      set({ error: 'Cart not initialized' });
      throw new Error('Cart not initialized');
    }

    try {
      set({ isLoading: true, error: null });

      const sanitizedUserId = state.userId.replace(/[.#$[\]]/g, '_');
      const itemRef = doc(db, 'users', sanitizedUserId, 'cart', itemId);
      await updateDoc(itemRef, { quantity });

      set({ isLoading: false, error: null });
    } catch (error) {
      console.error('Error updating item quantity:', error);
      set({ error: 'Failed to update item quantity', isLoading: false });
      throw error;
    }
  },

  clearCart: async () => {
    const state = get();
    if (!state.initialized || !state.userId) {
      set({ error: 'Cart not initialized' });
      throw new Error('Cart not initialized');
    }

    try {
      set({ isLoading: true, error: null });

      const sanitizedUserId = state.userId.replace(/[.#$[\]]/g, '_');
      const cartRef = collection(db, 'users', sanitizedUserId, 'cart');
      const snapshot = await getDocs(cartRef);

      // Delete all documents in parallel
      await Promise.all(
        snapshot.docs.map(doc => deleteDoc(doc.ref))
      );

      set({ items: [], isLoading: false, error: null });
    } catch (error) {
      console.error('Error clearing cart:', error);
      set({ error: 'Failed to clear cart', isLoading: false });
      throw error;
    }
  },

  reconnect: async () => {
    try {
      set({ isLoading: true, error: null });
      await enableNetwork(db);
      const state = get();
      if (state.userId) {
        await get().loadFromFirestore(state.userId);
      }
    } catch (error) {
      console.error('Reconnect error:', error);
      set({ error: 'Failed to reconnect' });
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
      set({ isLoading: true, error: null });
      
      // Sanitize userId and create cart reference with proper collection path
      const sanitizedUserId = userId.trim().replace(/[.#$[\]]/g, '_');
      const cartRef = collection(db, 'users', sanitizedUserId, 'cart');
      
      // Get current items
      const snapshot = await getDocs(cartRef);
      const currentItems = new Map(
        snapshot.docs.map(doc => [doc.id, doc.data() as CartItem])
      );

      // Update or create items
      const state = get();
      for (const item of state.items) {
        const itemRef = doc(cartRef, item.id);
        await setDoc(itemRef, item);
      }

      // Delete items that are no longer in the cart
      for (const [id, _] of currentItems) {
        if (!state.items.some(item => item.id === id)) {
          await deleteDoc(doc(cartRef, id));
        }
      }

    } catch (error) {
      console.error('Sync error:', error);
      set({ error: 'Failed to sync with server' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  checkout: async () => {
    const state = get();
    if (!state.initialized || !state.userId) {
      set({ error: 'Cart not initialized' });
      throw new Error('Cart not initialized');
    }

    if (state.items.length === 0) {
      set({ error: 'Cart is empty' });
      throw new Error('Cart is empty');
    }

    try {
      set({ isLoading: true, error: null });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: state.items,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('No checkout URL received');
      }

      // Clear cart after successful checkout initiation
      await get().clearCart();
      
      return url;
    } catch (error) {
      console.error('Checkout error:', error);
      set({ error: 'Failed to initiate checkout', isLoading: false });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export { useCartStore };
export type { CartItem };
