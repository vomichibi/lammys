'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import BookingPageComponent from './booking-page';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Footer from '@/components/ui/Footer';

export default function BookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }
  }, [user, loading, router]);

  if (isLoading || loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BookingPageComponent />
      <Footer />
    </>
  );
}