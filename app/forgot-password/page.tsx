'use client'

import { useState } from 'react'
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
      backgroundColor: 'rgba(59, 130, 246, 0.1)', // Blue color with low opacity
      top: top,
      left: left,
      zIndex: 0
    }}
  />
);

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (resetError) throw resetError

      setSuccess(true)
    } catch (err) {
      if (err instanceof Error) {
        setError('Failed to send reset email. Please try again.')
      } else {
        setError('An unexpected error occurred')
      }
      console.error('Password reset error:', err)
    } finally {
      setLoading(false)
    }
  }

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
        <Card className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-black/90">Reset your password</h2>
            <p className="mt-2 text-sm text-black/70">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-black/90">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription className="text-black/90">
                Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-black/90">Email address</Label>
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

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-black/80">
                Back to login{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
