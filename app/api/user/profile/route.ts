import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the user's profile from the profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist, create one with default values
      if (profileError.code === 'PGRST116') {
        const defaultProfile = {
          user_id: user.id,
          full_name: '',
          phone: '',
          email: user.email,
          address: '',
          preferences: {
            notifications: true,
            marketing_emails: false,
          },
        }

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([defaultProfile])
          .select()
          .single()

        if (createError) throw createError
        return NextResponse.json(newProfile)
      }
      throw profileError
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Update the profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: body.full_name,
        phone: body.phone,
        email: body.email,
        address: body.address,
        preferences: body.preferences,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
