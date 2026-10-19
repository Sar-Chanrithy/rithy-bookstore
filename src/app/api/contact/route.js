// src/app/api/contact/route.js
import { NextResponse } from 'next/server';
import { createContactMessage, getContacts, deleteContact } from '@/lib/contactDb';
import { sendTelegramContactNotification } from '@/lib/telegram';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body || {};

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name.' },
        { status: 400 }
      );
    }

    if (!email || !String(email).includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || !String(message).trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your message or question.' },
        { status: 400 }
      );
    }

    // 1. Save to database with automatic 30-day deletion
    const result = await createContactMessage({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    });

    // 2. Dispatch instant notification to Telegram (async, doesn't block user)
    sendTelegramContactNotification({
      name: String(name).trim(),
      email: String(email).trim(),
      message: String(message).trim(),
    }).catch((err) => console.warn('Telegram contact dispatch notice:', err.message));

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent to Bookoe support team!',
      contact: result.contact,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await getContacts();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contact messages.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Contact message ID is required.' },
        { status: 400 }
      );
    }

    const result = await deleteContact(id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete contact message.' },
      { status: 500 }
    );
  }
}
