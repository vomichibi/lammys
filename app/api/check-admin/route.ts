import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    if (error) throw error

    const isAdmin = user?.email === 'team@lammys.au'

    return NextResponse.json({ isAdmin })
  } catch (error) {
    console.error('Error checking admin status:', error)
    return NextResponse.json({ error: 'Failed to check admin status' }, { status: 500 })
  }
}
