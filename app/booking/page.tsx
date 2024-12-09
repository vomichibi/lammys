'use client';

import { useEffect, useState } from 'react';
import BookingPageComponent from './booking-page';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Footer from '@/components/ui/Footer';

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <BookingPageComponent />
      <Footer />
    </>
  );
}