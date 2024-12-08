import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing environment variables for Supabase configuration')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for type-safe database operations

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) throw error
  return data
}

export async function getBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      services (
        name,
        price
      )
    `)
    .eq('user_id', userId)
    .order('booking_date', { ascending: true })

  if (error) throw error
  return data
}

export async function createBooking(
  booking: Omit<Database['public']['Tables']['bookings']['Insert'], 'id' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getOrders(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        services (
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createOrder(
  order: Omit<Database['public']['Tables']['orders']['Insert'], 'id' | 'created_at' | 'updated_at'>,
  orderItems: Array<Omit<Database['public']['Tables']['order_items']['Insert'], 'id' | 'created_at' | 'order_id'>>
) {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()

  if (orderError) throw orderError

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(
      orderItems.map(item => ({
        ...item,
        order_id: orderData.id
      }))
    )

  if (itemsError) throw itemsError

  return orderData
}

export async function updateOrderStatus(orderId: string, status: string) {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) throw error
}
