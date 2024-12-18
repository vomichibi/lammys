import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';
import { sendBookingReminder } from '../../../lib/email';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async () => {
  try {
    // Get bookings for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        *,
        profiles (
          email
        ),
        services (
          name
        )
      `)
      .eq('booking_date', tomorrowStr)
      .eq('status', 'confirmed');

    if (error) throw error;

    // Send reminder for each booking
    for (const booking of bookings) {
      await sendBookingReminder(
        booking.profiles.email,
        {
          id: booking.id,
          date: booking.booking_date,
          time: booking.booking_time,
          service: booking.services.name
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully sent ${bookings.length} reminders`,
        success: true 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error sending reminders:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send reminders',
        success: false 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
