'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  category?: string;
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    // In a real application, you would get this data from a state management solution
    // For now, we'll use localStorage as a temporary solution
    const storedItems = localStorage.getItem('cartItems')
    if (storedItems) {
      const items = JSON.parse(storedItems)
      setCartItems(items)
      calculateTotal(items)
    }
  }, [])

  const calculateTotal = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
        : item.price
      return sum + (price * item.quantity)
    }, 0)
    setTotal(total)
  }

  const handleRemoveItem = (id: string) => {
    const newItems = cartItems.filter(item => item.id !== id)
    setCartItems(newItems)
    calculateTotal(newItems)
    localStorage.setItem('cartItems', JSON.stringify(newItems))
  }

  const handleUpdateQuantity = (id: string, change: number) => {
    const newItems = cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    setCartItems(newItems)
    calculateTotal(newItems)
    localStorage.setItem('cartItems', JSON.stringify(newItems))
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

          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Your cart is empty. Please add some items.
              </div>
            ) : (
              <>
                <div className="border-b border-gray-200 pb-4">
                  <h2 className="text-lg font-medium mb-3">Selected Items</h2>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
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
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <div className="text-lg font-medium">Total:</div>
                  <div className="text-xl font-semibold text-blue-600">
                    ${total.toFixed(2)}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => router.push('/booking/confirmation')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
