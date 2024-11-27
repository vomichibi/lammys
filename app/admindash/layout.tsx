'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/src/firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setCheckingAdmin(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        setIsAdmin(userData?.role === 'admin')
      } catch (error) {
        console.error('Error checking admin status:', error)
        setIsAdmin(false)
      }
      setCheckingAdmin(false)
    }

    if (!loading) {
      checkAdminStatus()
    }
  }, [user, loading])

  if (loading || checkingAdmin) {
    return <div>Loading...</div>
  }

  if (!user || !isAdmin) {
    router.push('/login')
    return null
  }

  return <>{children}</>
}
