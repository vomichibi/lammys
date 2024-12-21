'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (mounted) {
          if (initialSession) {
            setSession(initialSession);
            setUser(initialSession.user);
            
            // Check if user is admin
            const { data: profileData } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', initialSession.user.id)
              .single();
            
            setIsAdmin(profileData?.is_admin || false);
          }
          setLoading(false);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
          if (mounted) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);

            if (currentSession?.user) {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', currentSession.user.id)
                .single();
              
              setIsAdmin(profileData?.is_admin || false);
            } else {
              setIsAdmin(false);
            }
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
