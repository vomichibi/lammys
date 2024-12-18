'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { AuthUser } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: { full_name?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }

    return profile
  }

  // Update user state with profile data
  const updateUserState = async (userId: string, email: string | undefined) => {
    if (!email) return
    const profile = await fetchProfile(userId)
    
    setUser({
      id: userId,
      email,
      fullName: profile?.full_name || null,
      isAdmin: profile?.is_admin || false,
    })
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        updateUserState(session.user.id, session.user.email)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await updateUserState(session.user.id, session.user.email)

        // Handle redirects
        const currentPath = window.location.pathname
        if (session.user.email === 'team@lammys.au' && currentPath === '/dashboard') {
          router.push('/admindash/dashboard')
        } else if (
          session.user.email !== 'team@lammys.au' &&
          currentPath.startsWith('/admindash')
        ) {
          router.push('/dashboard')
        }
      } else {
        setUser(null)
        // Redirect to login if accessing protected routes
        if (
          window.location.pathname.startsWith('/dashboard') ||
          window.location.pathname.startsWith('/admindash')
        ) {
          router.push('/login')
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })
    if (signUpError) throw signUpError

    // Profile is created automatically via database trigger
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/')
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  }

  const updateProfile = async (data: { full_name?: string }) => {
    if (!user) throw new Error('No user logged in')

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id)

    if (error) throw error

    // Update local user state
    setUser(prev => prev ? { ...prev, fullName: data.full_name || prev.fullName } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
