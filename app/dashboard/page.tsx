'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabaseClient'
import { UserBookings } from './components/UserBookings'
import { UserProfile } from './components/UserProfile'
import { OrderHistory } from './components/OrderHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { LogOut, Calendar, History, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAdmin } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (isAdmin) {
      router.push('/admindash/dashboard')
    }
  }, [user, isAdmin, router])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user || isAdmin) return null

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

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="bookings">
                <Calendar className="mr-2 h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="orders">
                <History className="mr-2 h-4 w-4" />
                Order History
              </TabsTrigger>
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
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
