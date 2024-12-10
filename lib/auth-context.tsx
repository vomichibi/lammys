'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    const checkAdminStatus = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .maybeSingle()
        
        if (mounted && !error) {
          setIsAdmin(!!profile?.is_admin)
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        if (mounted) {
          setIsAdmin(false)
        }
      }
    }

    const setupAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await checkAdminStatus(session.user.id)
          }
          setLoading(false)
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              setUser(session?.user ?? null)
              if (session?.user) {
                await checkAdminStatus(session.user.id)
              } else {
                setIsAdmin(false)
              }
              setLoading(false)
            }
          }
        )

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error setting up auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    setupAuth()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
