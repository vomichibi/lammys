'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/ui/Footer';

// Improved dynamic import with better loading state and error handling
const BookingPageComponent = dynamic(
  () => import('./booking-page').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading booking page...</p>
        </div>
      </div>
    )
  }
);

export default function BookingPage() {
  return (
    <>
      <BookingPageComponent />
      <Footer />
    </>
  );
}