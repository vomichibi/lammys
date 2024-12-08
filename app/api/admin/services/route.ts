import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/supabase-auth';
import { handleApiError } from '@/lib/error-handling';

// Middleware to check admin status
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized');
  }
}

export async function GET() {
  try {
    await checkAdmin();

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('name');

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch services');
  }
}

export async function POST(request: Request) {
  try {
    await checkAdmin();

    const body = await request.json();
    const { name, description, price, category } = body;

    const { data, error } = await supabaseAdmin
      .from('services')
      .insert([
        {
          name,
          description,
          price,
          category,
          active: true
        }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error, 'Failed to create service');
  }
}
