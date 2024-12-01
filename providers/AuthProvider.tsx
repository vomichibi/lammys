'use client';

import { ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { AuthUser, isAdmin } from '@/lib/firebase-auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Transform Firebase user to AuthUser
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          isAdmin: isAdmin(firebaseUser)
        });

        // Redirect admin users to admin dashboard
        if (isAdmin(firebaseUser) && window.location.pathname === '/dashboard') {
          router.push('/admindash/dashboard');
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

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>;
  }

  return <>{children}</>;
}
