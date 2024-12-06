'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { AuthUser } from '@/types/auth';

const AuthContext = createContext<{
  user: AuthUser | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          isAdmin: session.user.email === 'team@lammys.au'
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          isAdmin: session.user.email === 'team@lammys.au'
        });

        // Redirect admin users to admin dashboard, regular users to user dashboard
        const currentPath = window.location.pathname;
        if (session.user.email === 'team@lammys.au' && currentPath === '/dashboard') {
          router.push('/admindash/dashboard');
        } else if (session.user.email !== 'team@lammys.au' && currentPath.startsWith('/admindash')) {
          router.push('/dashboard');
        }
      } else {
        setUser(null);
        // Redirect to login if accessing protected routes
        if (window.location.pathname.startsWith('/dashboard') || 
            window.location.pathname.startsWith('/admindash')) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return <AuthContext.Provider value={{ user, loading }}>
    {children}
  </AuthContext.Provider>;
}
