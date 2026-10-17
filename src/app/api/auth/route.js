// src/app/api/auth/route.js
import { NextResponse } from 'next/server';
import { findUserByEmail, registerUser, authenticateUser } from '@/lib/userDb';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Bookoe Authentication Service with Database Support',
    demoAccounts: [
      { email: 'reader.john@bookoe.com', password: 'password123', role: 'VIP Member' },
      { email: 'soksan@bookoe.kh', password: 'password123', role: 'Khmer Reader Club' }
    ]
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, email, password, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    // 1. REGISTER (Sign Up)
    if (action === 'register') {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists. Please Sign In instead.' },
          { status: 409 }
        );
      }

      const displayName = name?.trim() || email.split('@')[0];
      const newUser = await registerUser({
        name: displayName,
        email,
        password: password || 'password123',
        role: 'VIP Member'
      });

      return NextResponse.json({
        success: true,
        message: 'Account registered successfully in database!',
        user: newUser
      });
    }

    // 2. LOGIN (Sign In)
    const authResult = await authenticateUser(email, password);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully from database!',
      user: authResult.user
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
