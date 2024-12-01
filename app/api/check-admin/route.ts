import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if the email matches and user has admin claim
    if (email !== 'team@lammys.au' || !decodedToken.admin) {
      return NextResponse.json({ 
        error: 'Not authorized',
        message: 'User does not have admin privileges'
      }, { status: 403 });
    }

    return NextResponse.json({ 
      isAdmin: true,
      email: decodedToken.email,
      uid: decodedToken.uid
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ 
      error: 'Authentication failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 403 });
  }
}
