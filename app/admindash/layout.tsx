'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading) {
        if (!user) {
          router.push('/login')
          return
        }

        try {
          const token = await user.getIdToken()
          const response = await fetch('/api/check-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
          })

          if (!response.ok) {
            router.push('/')
          }
        } catch (error) {
          console.error('Admin check error:', error)
          router.push('/')
        }
      }
    }

    checkAdminAccess()
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return children
}
