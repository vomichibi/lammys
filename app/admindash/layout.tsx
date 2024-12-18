'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabaseClient'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading, isAdmin } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        if (!loading) {
          setIsChecking(true)
          console.log('Checking admin access:', { user: user?.email, isAdmin })

          if (!user) {
            console.log('No user found, showing access denied')
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Access Denied. Please log in with an admin account.</div>
              </div>
            )
          }

          // Double-check admin status directly
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Error checking admin status:', error)
            router.push('/')
            return
          }

          console.log('Profile data:', profile)
          
          if (!profile?.is_admin) {
            console.log('Not an admin user')
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-600">Access Denied. Admin privileges required.</div>
              </div>
            )
          }

          console.log('Admin access confirmed')
          setIsChecking(false)
        }
      } catch (error) {
        console.error('Error in checkAdminAccess:', error)
        router.push('/')
      }
    }

    checkAdminAccess()
  }, [user, loading, router, isAdmin])

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
