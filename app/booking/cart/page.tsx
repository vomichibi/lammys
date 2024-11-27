'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CartPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
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
  const { toast } = useToast()

  const [isInitializing, setIsInitializing] = useState(true)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  useEffect(() => {
    let mounted = true

    const initCart = async () => {
      if (!user?.email) return
      
      try {
        setIsInitializing(true)
        await initializeCart(user.email)
        
        if (mounted) {
          await loadFromFirestore(user.email)
          await syncWithFirestore(user.email)
        }
      } catch (error) {
        console.error('Error initializing/loading cart:', error)
        if (mounted) {
          setError('Failed to load cart. Please try again or refresh the page.')
        }
      } finally {
        if (mounted) {
          setIsInitializing(false)
        }
      }
    }

    initCart()

    return () => {
      mounted = false
    }
  }, [user?.email])

  const handleRemoveItem = async (id: string) => {
    if (!user?.email) return
    
    try {
      await removeItem(id)
      await syncWithFirestore(user.email)
    } catch (error) {
      console.error('Error removing item:', error)
      setError('Failed to remove item. Please try again.')
    }
  }

  const handleUpdateQuantity = async (id: string, change: number) => {
    if (!user?.email) return

    const item = items.find(item => item.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change)
      try {
        await updateQuantity(id, newQuantity)
        await syncWithFirestore(user.email)
      } catch (error) {
        console.error('Error updating quantity:', error)
        setError('Failed to update quantity. Please try again.')
      }
    }
  }

  const handleCheckout = async () => {
    if (!user?.email) {
      router.push('/login')
      return
    }

    try {
      setIsCheckingOut(true)
      setError(null)
      const checkoutUrl = await checkout()
      window.location.href = checkoutUrl
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Failed to start checkout. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) 
        : item.price
      return total + (price * item.quantity)
    }, 0)
  }

  if (loading || isInitializing || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-4">You need to be signed in to view your cart.</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error}</h2>
          <Button onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart to get started.</p>
          <Button onClick={() => router.push('/booking')}>
            Browse Services
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid gap-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  {item.category} - Quantity: {item.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                  >
                    +
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">
                    ${typeof item.price === 'string'
                      ? parseFloat(item.price.toString().replace(/[^0-9.]/g, '')) * item.quantity
                      : item.price * item.quantity}
                  </p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-2xl font-bold">${calculateTotal()}</span>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </Button>
        </div>
      </div>
    </div>
  )
}
