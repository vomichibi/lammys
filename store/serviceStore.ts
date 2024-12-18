'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { Service } from '@/types/auth'

interface ServiceStore {
  services: Service[]
  isLoading: boolean
  error: string | null
  fetchServices: () => Promise<void>
  createService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateService: (id: string, updates: Partial<Service>) => Promise<void>
  toggleServiceStatus: (id: string) => Promise<void>
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    try {
      set({ isLoading: true, error: null })

      const { data: services, error } = await supabase
        .from('services')
        .select('*')
        .order('category')
        .order('name')

      if (error) throw error
      set({ services: services || [] })
    } catch (error: any) {
      console.error('Error fetching services:', error)
      set({ error: error?.message || 'Failed to fetch services' })
    } finally {
      set({ isLoading: false })
    }
  },

  createService: async (service) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase
        .from('services')
        .insert([service])

      if (error) throw error

      // Refresh services list
      await get().fetchServices()
    } catch (error: any) {
      console.error('Error creating service:', error)
      set({ error: error?.message || 'Failed to create service' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateService: async (id, updates) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      set(state => ({
        services: state.services.map(service =>
          service.id === id ? { ...service, ...updates } : service
        )
      }))
    } catch (error: any) {
      console.error('Error updating service:', error)
      set({ error: error?.message || 'Failed to update service' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  toggleServiceStatus: async (id) => {
    try {
      set({ isLoading: true, error: null })

      const service = get().services.find(s => s.id === id)
      if (!service) throw new Error('Service not found')

      const { error } = await supabase
        .from('services')
        .update({ active: !service.active })
        .eq('id', id)

      if (error) throw error

      set(state => ({
        services: state.services.map(service =>
          service.id === id ? { ...service, active: !service.active } : service
        )
      }))
    } catch (error: any) {
      console.error('Error toggling service status:', error)
      set({ error: error?.message || 'Failed to toggle service status' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
}))
