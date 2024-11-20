'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/ui/Footer';

const BookingPageComponent = dynamic(() => import('./booking-page'), {
  ssr: false
});

export default function BookingPage() {
  return (
    <>
      <BookingPageComponent />
      <Footer />
    </>
  );
}