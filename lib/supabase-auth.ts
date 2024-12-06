import { supabase } from './supabase'

export type AuthUser = {
  id: string
  email: string | null
  isAdmin: boolean
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error

  // Get user's admin status
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', data.user.id)
    .single()

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      isAdmin: profile?.is_admin || false,
    },
    session: data.session,
  }
}

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) throw error

  // Create a profile for the new user
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      is_admin: false, // Default to non-admin
    })
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password,
  })
  if (error) throw error
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', session.user.id)
    .single()

  return {
    id: session.user.id,
    email: session.user.email,
    isAdmin: profile?.is_admin || false,
  }
}
