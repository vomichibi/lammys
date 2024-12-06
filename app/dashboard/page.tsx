'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LogOutIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Footer from '@/components/ui/Footer';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user?.isAdmin) {
      router.push('/admindash/dashboard');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      // Update signOut function to use Supabase
      // await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign out</span>
            </Button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}</h2>
            {/* Dashboard Type Indicator */}
            <div className="mb-8 flex justify-between items-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Customer Dashboard
              </span>
            </div>

            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.email}!
              </h1>
              <p className="text-gray-600">
                Manage your dry cleaning orders and account settings here.
              </p>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Active Orders */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Orders</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <p className="font-medium">Order #12345</p>
                    <p className="text-sm text-gray-600">Status: In Progress</p>
                    <p className="text-sm text-gray-600">Ready by: Tomorrow, 5 PM</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <p className="font-medium">Order #12344</p>
                    <p className="text-sm text-gray-600">Status: Ready for Pickup</p>
                    <p className="text-sm text-gray-600">Ready since: Today, 2 PM</p>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Orders →
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    New Booking
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                    Track Order
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 transition-colors">
                    View History
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Order Completed</p>
                      <p className="text-xs text-gray-500">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">New Booking Made</p>
                      <p className="text-xs text-gray-500">5 days ago</p>
                    </div>
                  </div>
                </div>
                <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View All Activity →
                </button>
              </div>
            </div>

            {/* Settings Section */}
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {user?.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {user?.email}
                    </p>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit Profile
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="email-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-600">
                        Email Notifications
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="sms-notifications"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-600">
                        SMS Notifications
                      </label>
                    </div>
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Update Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  );
}
