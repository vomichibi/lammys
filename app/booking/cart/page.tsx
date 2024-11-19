'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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
    isLoading,
    error,
    setError 
  } = useCartStore()

  const total = items.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
      : item.price
    return sum + (price * item.quantity)
  }, 0)

  useEffect(() => {
    if (session?.user?.email) {
      loadFromFirestore(session.user.email).catch((error) => {
        console.error('Error loading cart:', error);
        setError('Failed to load cart from server. Using local data.');
      });
    }
  }, [session, loadFromFirestore, setError])

  const handleRemoveItem = async (id: string) => {
    removeItem(id)
    if (session?.user?.email) {
      await syncWithFirestore(session.user.email).catch((error) => {
        console.error('Error syncing cart:', error);
        setError('Failed to sync cart. Changes will be saved locally.');
      });
    }
  }

  const handleUpdateQuantity = async (id: string, change: number) => {
    const item = items.find(item => item.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      updateQuantity(id, newQuantity)
      if (session?.user?.email) {
        await syncWithFirestore(session.user.email).catch((error) => {
          console.error('Error syncing cart:', error);
          setError('Failed to sync cart. Changes will be saved locally.');
        });
      }
    }
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

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading your cart...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Your cart is empty. Please add some items.
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
