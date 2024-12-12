'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/AuthProvider'
import { UserBookings } from './components/UserBookings'
import { UserProfile } from './components/UserProfile'
import { OrderHistory } from './components/OrderHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, History, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, signOut, isAdmin } = useAuth()

  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admindash')
    }
  }, [user, isAdmin, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return null; // Will be redirected by useEffect
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back{user.email ? `, ${user.email}` : ''}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your bookings and account settings
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bookings" className="space-x-2">
                <Calendar className="h-4 w-4" />
                <span>My Bookings</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="space-x-2">
                <History className="h-4 w-4" />
                <span>Order History</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              <UserBookings />
            </TabsContent>

            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>

            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
