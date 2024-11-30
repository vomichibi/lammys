'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Force token refresh to get latest custom claims
        await user.getIdToken(true)
        const idTokenResult = await user.getIdTokenResult()
        setIsAdmin(!!idTokenResult.claims.admin)
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
