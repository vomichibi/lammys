'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { Booking } from '@/types/auth'

interface BookingStore {
  bookings: Booking[]
  isLoading: boolean
  error: string | null
  fetchUserBookings: () => Promise<void>
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateBookingStatus: (id: string, status: string) => Promise<void>
  cancelBooking: (id: string) => Promise<void>
  selectedDate: Date | null
  selectedTime: string | null
  selectedService: string | null
  setSelectedDate: (date: Date | null) => void
  setSelectedTime: (time: string | null) => void
  setSelectedService: (service: string | null) => void
  resetBooking: () => void
}

const useBookingStore = create<BookingStore>()((set, get) => ({
  bookings: [],
  isLoading: false,
  error: null,
  selectedDate: null,
  selectedTime: null,
  selectedService: null,

  fetchUserBookings: async () => {
    try {
      set({ isLoading: true, error: null })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('booking_date', { ascending: true })

      if (error) throw error
      set({ bookings: bookings || [] })
    } catch (error: any) {
      set({ error: error.message })
    } finally {
      set({ isLoading: false })
    }
  },

  createBooking: async (booking) => {
    try {
      set({ isLoading: true, error: null })
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('bookings')
        .insert([{ ...booking, user_id: user.id }])

      if (error) throw error
      await get().fetchUserBookings()
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === id ? { ...booking, status } : booking
        )
      }))
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  cancelBooking: async (id) => {
    try {
      set({ isLoading: true, error: null })
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id)

      if (error) throw error
      set(state => ({
        bookings: state.bookings.map(booking =>
          booking.id === id ? { ...booking, status: 'cancelled' } : booking
        )
      }))
    } catch (error: any) {
      set({ error: error.message })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setSelectedService: (service) => set({ selectedService: service }),
  resetBooking: () => set({
    selectedDate: null,
    selectedTime: null,
    selectedService: null
  })
}))

export default useBookingStore
