import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch order with related services information
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          service_id,
          quantity,
          price,
          services (
            name
          )
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      throw orderError;
    }

    // Transform the data to include service names directly in items
    const transformedOrder = {
      ...order,
      items: order.items.map((item: any) => ({
        service_id: item.service_id,
        service_name: item.services.name,
        quantity: item.quantity,
        price: item.price
      }))
    };

    return NextResponse.json(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
