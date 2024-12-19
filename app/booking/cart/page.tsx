'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const router = useRouter()
  const { user } = useAuth()
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
    initialized,
    checkout 
  } = useCartStore()

  const [isInitializing, setIsInitializing] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const total = items.reduce((sum: number, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
      : item.price
    return sum + (price * item.quantity)
  }, 0)

  useEffect(() => {
    let mounted = true;

    const initCart = async () => {
      if (!user?.email) return;
      
      try {
        setIsInitializing(true);
        await initializeCart(user.email);
        
        if (mounted) {
          await loadFromFirestore(user.email);
          await syncWithFirestore(user.email);
        }
      } catch (error) {
        console.error('Error initializing/loading cart:', error);
        if (mounted) {
          setError('Failed to load cart. Please try again or refresh the page.');
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
  }, [user?.email]);

  const handleRemoveItem = async (id: string) => {
    if (!user?.email) return;
    
    try {
      await removeItem(id);
      await syncWithFirestore(user.email);
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Failed to remove item. Please try again.');
    }
  }

  const handleUpdateQuantity = async (id: string, change: number) => {
    if (!user?.email) return;

    const item = items.find(item => item.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      try {
        await updateQuantity(id, newQuantity);
        await syncWithFirestore(user.email);
      } catch (error) {
        console.error('Error updating quantity:', error);
        setError('Failed to update quantity. Please try again.');
      }
    }
  }

  const handleCheckout = () => {
    if (!user?.email) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Redirect to checkout page
    router.push('/booking/checkout');
  };

  if (!user) {
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
                          disabled={isCheckingOut}
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100"
                          disabled={isCheckingOut}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={isCheckingOut}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
              </div>
　
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => router.push('/booking')}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isCheckingOut}
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut || items.length === 0}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isCheckingOut || items.length === 0
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
