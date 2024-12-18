import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { sendBookingConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { serviceId, bookingDate, bookingTime } = body;

    // Create booking in Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_id: serviceId,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: 'confirmed'
      })
      .select(`
        *,
        profiles (
          email
        ),
        services (
          name,
          price
        )
      `)
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // Send confirmation email
    await sendBookingConfirmation(
      booking.profiles.email,
      {
        id: booking.id,
        date: booking.booking_date,
        time: booking.booking_time,
        service: booking.services.name,
        price: booking.services.price
      }
    );

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        services (
          name,
          price,
          description
        )
      `)
      .eq('user_id', user.id)
      .order('booking_date', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
