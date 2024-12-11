import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Admin helper functions

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function updateUserRole(userId: string, updates: { role: string; is_admin: boolean }) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function getAllBookings() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      profiles (
        email,
        full_name
      ),
      services (
        name,
        price
      )
    `)
    .order('booking_date', { ascending: true })

  if (error) throw error
  return data
}

export async function getAllOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      profiles (
        email,
        full_name
      ),
      order_items (
        *,
        services (
          name
        )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getBusinessMetrics(startDate: Date, endDate: Date) {
  // Get total revenue
  const { data: revenue, error: revenueError } = await supabaseAdmin
    .from('orders')
    .select('total_amount')
    .eq('status', 'paid')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (revenueError) throw revenueError

  // Get top services
  const { data: topServices, error: servicesError } = await supabaseAdmin
    .from('order_items')
    .select(`
      services (
        name
      ),
      quantity,
      price
    `)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (servicesError) throw servicesError

  // Get new users count
  const { count: newUsers, error: usersError } = await supabaseAdmin
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  if (usersError) throw usersError

  return {
    revenue: revenue.reduce((sum, order) => sum + order.total_amount, 0),
    topServices: topServices.reduce((acc, item) => {
      const serviceName = item.services?.name || 'Unknown'
      if (!acc[serviceName]) {
        acc[serviceName] = { revenue: 0, quantity: 0 }
      }
      acc[serviceName].revenue += item.price * item.quantity
      acc[serviceName].quantity += item.quantity
      return acc
    }, {} as Record<string, { revenue: number; quantity: number }>),
    newUsers
  }
}
