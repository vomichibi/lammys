'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function EmailConfirmContent() {
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
            type: 'email_change',
            email: searchParams.get('email') || ''
          });

          if (error) throw error;
          setMessage('Email successfully changed! Redirecting...');
        } else {
          // Handle signup confirmation
          const { error } = await supabase.auth.verifyOtp({
            token: token as string,
            type: 'signup',
            email: searchParams.get('email') || ''
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
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Confirmation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmailConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailConfirmContent />
    </Suspense>
  );
}
