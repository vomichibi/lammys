import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Get the session token from cookies
    const sessionCookie = cookies().get('session')?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Unauthorized - No session cookie' },
        { status: 401 }
      );
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    if (!decodedClaims) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid session' },
        { status: 401 }
      );
    }

    const { items, total } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request - Items are required' },
        { status: 400 }
      );
    }

    // Process the checkout with the authenticated user's information
    // Add your checkout logic here
    // For example, create an order in your database

    return NextResponse.json({
      success: true,
      message: 'Checkout successful',
      orderId: 'generated-order-id', // Replace with actual order ID
      userId: decodedClaims.uid,
      userEmail: decodedClaims.email,
      items,
      total
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
