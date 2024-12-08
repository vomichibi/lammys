'use client'

import { useEffect } from 'react'
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

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login')
          return
        }

        // Check if user is admin using the isAdmin flag from auth context
        if (!isAdmin) {
          console.log('Not an admin user')
          router.push('/')
          return
        }
      }
    }

    checkAdminAccess()
  }, [user, loading, router, isAdmin])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
