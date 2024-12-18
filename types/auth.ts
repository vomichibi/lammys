export interface AuthUser {
  id: string
  email: string | undefined
  fullName: string | null
  isAdmin: boolean
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: string
  created_at: string
  last_login_at: string | null
  is_admin: boolean
}

export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  booking_date: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  service?: Service
}

export interface Order {
  id: string
  user_id: string
  status: string
  total_amount: number
  payment_intent: string | null
  session_id: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  service_id: string
  quantity: number
  price: number
  created_at: string
  service?: Service
}
