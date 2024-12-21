import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/supabase-auth';

// Middleware to check admin status
async function checkAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    throw new Error('Unauthorized');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdmin();

    const body = await request.json();
    const { name, description, price, category, active } = body;

    const { data, error } = await supabaseAdmin
      .from('services')
      .update({
        name,
        description,
        price,
        category,
        active,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdmin();

    // Instead of actually deleting, we'll just mark it as inactive
    const { error } = await supabaseAdmin
      .from('services')
      .update({
        active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await checkAdmin();

    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
    );
  }
}
