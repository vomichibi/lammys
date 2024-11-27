import { NextResponse } from 'next/server';
import { auth, db } from '@/src/firebase/admin';
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

    // Create order in Firestore
    const orderData = {
      userId: decodedClaims.uid,
      userEmail: decodedClaims.email,
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };

    const orderRef = await db.collection('orders').add(orderData);

    return NextResponse.json({
      success: true,
      message: 'Checkout successful',
      orderId: orderRef.id,
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
