'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from '@/lib/utils/date';
import Link from 'next/link';

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  services: {
    name: string;
    price: number;
  };
}

export function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  const upcomingBookings = bookings.filter(
    booking => new Date(booking.booking_date) >= new Date()
  );

  const pastBookings = bookings.filter(
    booking => new Date(booking.booking_date) < new Date()
  );

  return (
    <div className="space-y-6">
      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming Bookings</h2>
        {upcomingBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">No upcoming bookings</p>
              <Link href="/booking" className="mt-4 inline-block">
                <Button>Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.services.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Date: {formatDate(booking.booking_date)}</p>
                    <p>Time: {booking.booking_time}</p>
                    <p>Price: £{booking.services.price.toFixed(2)}</p>
                    <p>Status: {booking.status}</p>
                    <Button variant="outline" asChild>
                      <Link href={`/booking/${booking.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Bookings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Past Bookings</h2>
        {pastBookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-600">No past bookings</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pastBookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <CardTitle>{booking.services.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Date: {formatDate(booking.booking_date)}</p>
                    <p>Time: {booking.booking_time}</p>
                    <p>Price: £{booking.services.price.toFixed(2)}</p>
                    <p>Status: {booking.status}</p>
                    <div className="space-x-2">
                      <Button variant="outline" asChild>
                        <Link href={`/booking/${booking.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href={`/booking?service=${booking.services.name}`}>
                          Book Again
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
