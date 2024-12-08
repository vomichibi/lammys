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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black/90">
          Book a Service
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/90 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black/90">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black/90">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-black/90">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="service" className="block text-sm font-medium text-black/90">
                Service Type
              </label>
              <div className="mt-1">
                <select
                  id="service"
                  name="service"
                  required
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">Select a service</option>
                  <option value="dry-cleaning">Dry Cleaning</option>
                  <option value="alterations">Alterations</option>
                  <option value="key-cutting">Key Cutting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-black/90">
                Preferred Date
              </label>
              <div className="mt-1">
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="additionalNotes" className="block text-sm font-medium text-black/90">
                Additional Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  rows={4}
                  className="block w-full rounded-md border border-gray-300 bg-gray-50 py-2 pl-10 text-sm text-gray-900 focus:border-gray-500 focus:ring-gray-500"
                  placeholder="Any additional information or special requests"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              >
                Book Service
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}