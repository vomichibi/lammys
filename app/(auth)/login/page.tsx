'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Bubble component for background animation
const Bubble = ({ 
  size, 
  top, 
  left, 
  delay, 
  duration 
}: { 
  size: number, 
  top: string, 
  left: string, 
  delay: number, 
  duration: number 
}) => (
  <motion.div
    initial={{ 
      scale: 0, 
      opacity: 0 
    }}
    animate={{ 
      scale: [0, 1.2, 1], 
      opacity: [0, 0.7, 0.5, 0] 
    }}
    transition={{
      duration: duration,
      delay: delay,
      repeat: Infinity,
      repeatType: 'loop'
    }}
    style={{
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Blue color with low opacity
      top: top,
      left: left,
      zIndex: 0
    }}
  />
);

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

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Redirect based on email
      if (formData.email === 'team@lammys.au') {
        router.push('/admindash/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/5 to-blue-100/5 overflow-hidden">
      {/* Animated Bubble Background */}
      {[...Array(15)].map((_, i) => (
        <Bubble 
          key={i}
          size={Math.random() * 200 + 50}
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          delay={Math.random() * 5}
          duration={Math.random() * 10 + 5}
        />
      ))}

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 space-y-8 bg-white/90 rounded-xl shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black/90">Welcome Back</h2>
          <p className="mt-2 text-sm text-black/70">
            Sign in to continue to Lammy's Multi-Services
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-black/90">{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="email" className="text-black/90">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              placeholder="Enter your email"
              className="mt-1 text-black/90 placeholder:text-black/60 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-black/90">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="Enter your password"
              className="mt-1 text-black/90 placeholder:text-black/60 bg-white"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-black/80">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Don't have an account?
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
