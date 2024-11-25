import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase-config';

export interface AuthUser {
  id: string;
  email: string | null;
  isAdmin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // You can modify this to include additional user data from your database
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          isAdmin: firebaseUser.email === 'team@lammys.au' // Add your admin logic here
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };
}
