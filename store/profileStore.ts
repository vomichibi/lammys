'use client'

import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'
import type { Profile } from '@/types/auth'

interface ProfileStore {
  profile: Profile | null
  isLoading: boolean
  error: string | null
  fetchProfile: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string | null>
  deleteAvatar: () => Promise<void>
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      set({ profile })
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      set({ error: error?.message || 'Failed to fetch profile' })
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (updates) => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      set(state => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      }))
    } catch (error: any) {
      console.error('Error updating profile:', error)
      set({ error: error?.message || 'Failed to update profile' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Generate unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      await get().updateProfile({ avatar_url: publicUrl })

      return publicUrl
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      set({ error: error?.message || 'Failed to upload avatar' })
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  deleteAvatar: async () => {
    try {
      set({ isLoading: true, error: null })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const profile = get().profile
      if (!profile?.avatar_url) return

      // Extract file path from URL
      const urlParts = profile.avatar_url.split('avatars/')
      if (urlParts.length !== 2) return

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`avatars/${urlParts[1]}`])

      if (deleteError) throw deleteError

      // Update profile to remove avatar URL
      await get().updateProfile({ avatar_url: null })
    } catch (error: any) {
      console.error('Error deleting avatar:', error)
      set({ error: error?.message || 'Failed to delete avatar' })
      throw error
    } finally {
      set({ isLoading: false })
    }
  }
}))
