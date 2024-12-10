'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EmailConfirmPage() {
  const [message, setMessage] = useState('Verifying your email...');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the token from URL parameters
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (type === 'email_change') {
          // Handle email change confirmation
          const { error } = await supabase.auth.verifyOtp({
            token: token as string,
            type: 'email_change'
          });

          if (error) throw error;
          setMessage('Email successfully changed! Redirecting...');
        } else {
          // Handle signup confirmation
          const { error } = await supabase.auth.verifyOtp({
            token: token as string,
            type: 'signup'
          });

          if (error) throw error;
          setMessage('Email confirmed successfully! Redirecting...');
        }

        // Redirect to login page after successful confirmation
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Error confirming email:', error);
        setMessage('Error confirming email. Please try again or contact support.');
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
        </div>
      </div>
    </div>
  );
}
