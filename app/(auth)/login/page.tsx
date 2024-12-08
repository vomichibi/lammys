'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Starting login process...', { email: formData.email });

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      console.log('Attempting to sign in with Supabase...');
      let signInResult;
      try {
        signInResult = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        console.log('Raw sign in result:', signInResult);
      } catch (signInError) {
        console.error('Sign in threw error:', signInError);
        throw signInError;
      }

      const { data, error: signInError } = signInResult;

      if (signInError) {
        console.error('Sign in error from response:', signInError);
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data?.user) {
        console.error('No user data returned from sign in');
        setError('No user data returned');
        setLoading(false);
        return;
      }

      console.log('Successfully signed in user:', data.user.id);

      try {
        // Get current session to verify authentication
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session verification error:', sessionError);
          throw sessionError;
        }
        if (!session) {
          console.error('No session after sign in');
          throw new Error('Authentication failed - no session');
        }
        console.log('Session verified');

        console.log('Fetching user profile...');
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // Create a new user profile if it doesn't exist
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              { 
                id: data.user.id,
                email: data.user.email,
                is_admin: false // default to non-admin
              }
            ]);
            
          if (insertError) {
            console.error('Error creating user profile:', insertError);
          }
          // Default to regular dashboard
          await router.push('/dashboard');
          return;
        }

        console.log('User profile:', profile);
        const targetPath = profile?.is_admin ? '/admindash/dashboard' : '/dashboard';
        console.log('Redirecting to:', targetPath);
        
        try {
          await router.push(targetPath);
          console.log('Navigation successful');
        } catch (routerError) {
          console.error('Router push error:', routerError);
          throw routerError;
        }
      } catch (navError) {
        console.error('Navigation/profile error:', navError);
        setError('Error during navigation. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-4 text-gray-600">Signing in...</div>
          {error && (
            <div className="mt-2 text-red-600">{error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
