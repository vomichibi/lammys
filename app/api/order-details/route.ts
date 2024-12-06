import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const orderId = searchParams.get('orderId')
    const token = searchParams.get('token')

    if (!orderId || !token) {
      return NextResponse.json(
        { error: 'Missing orderId or token' },
        { status: 400 }
      )
    }

    // Verify user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError) throw authError

    // Fetch order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if user owns this order or is admin
    if (order.user_id !== user.id && user.email !== 'team@lammys.au') {
      return NextResponse.json(
        { error: 'Not authorized to view this order' },
        { status: 403 }
      )
    }

    return NextResponse.json({ order })
  } catch (error: any) {
    console.error('Error fetching order details:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
