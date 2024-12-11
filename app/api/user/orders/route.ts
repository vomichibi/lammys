import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch orders with related services information
    const { data: orders, error: ordersError } = await supabase
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    // Transform the data to include service names directly in items
    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map((item: any) => ({
        service_id: item.service_id,
        service_name: item.services.name,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    return NextResponse.json(transformedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, total_amount } = body;

    // Start a Supabase transaction
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      service_id: item.service_id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
