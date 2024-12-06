import { NextResponse } from 'next/server';
import { getBusinessMetrics } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const metrics = await getBusinessMetrics(new Date(startDate), new Date(endDate));

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching business metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business metrics' },
      { status: 500 }
    );
  }
}
