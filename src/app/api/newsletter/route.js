// src/app/api/newsletter/route.js
import { NextResponse } from 'next/server';
import { addSubscriber, getSubscribers } from '@/lib/subscriberDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = await addSubscriber(email);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process subscription.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const data = await getSubscribers();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch subscribers.' },
      { status: 500 }
    );
  }
}
