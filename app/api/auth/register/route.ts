import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Temporary user store (replace with database in production)
let users: any[] = [];

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (in memory for now)
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    // Return success response (exclude password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
