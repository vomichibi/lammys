'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    syncWithFirestore, 
    loadFromFirestore,
    initializeCart,
    isLoading,
    error,
    setError,
    initialized 
  } = useCartStore()

  const [isInitializing, setIsInitializing] = useState(true)

  const total = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
      : item.price
    return sum + (price * item.quantity)
  }, 0)

  useEffect(() => {
    let mounted = true;

    const initCart = async () => {
      if (!session?.user?.email) return;
      
      try {
        setIsInitializing(true);
        if (!initialized) {
          await initializeCart(session.user.email);
        }
        if (mounted) {
          await loadFromFirestore(session.user.email);
        }
      } catch (error) {
        console.error('Error initializing/loading cart:', error);
        if (mounted) {
          setError('Failed to load cart. Please refresh the page to try again.');
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    initCart();

    return () => {
      mounted = false;
    };
  }, [session, initializeCart, loadFromFirestore, setError, initialized]);

  const handleRemoveItem = async (id: string) => {
    if (!session?.user?.email) return;
    
    try {
      await removeItem(id);
      await syncWithFirestore(session.user.email);
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  }

  const handleUpdateQuantity = async (id: string, change: number) => {
    if (!session?.user?.email) return;

    const item = items.find(item => item.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      try {
        await updateQuantity(id, newQuantity);
        await syncWithFirestore(session.user.email);
      } catch (error) {
        console.error('Error updating quantity:', error);
        setError('Failed to update quantity. Please try again.');
      }
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Please sign in to view your cart</h2>
          </div>
        </div>
      </div>
    )
  }

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Loading cart...</h2>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600">{error}</h2>
            <button 
              onClick={() => setError(null)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-4 text-gray-500">Add some items to your cart to get started.</p>
            <button
              onClick={() => router.push('/booking')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Your Cart</h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Booking
            </button>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-medium mb-3">Selected Items</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
