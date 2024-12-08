'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card } from '@/components/ui/card'

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
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      top: top,
      left: left,
      zIndex: 0
    }}
  />
);

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            email: email
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Successful registration logic
      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden">
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
          <h2 className="text-3xl font-bold text-black/90">Create an Account</h2>
          <p className="mt-2 text-sm text-black/70">
            Join Lammy's Multi-Services today!
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-black/90">{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="name" className="text-black/90">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your full name"
              className="mt-1 text-black/90 placeholder:text-black/60 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-black/90">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
              className="mt-1 text-black/90 placeholder:text-black/60 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-black/90">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
              className="mt-1 text-black/90 placeholder:text-black/60 bg-white"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-black/80">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
