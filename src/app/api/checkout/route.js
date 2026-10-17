// src/app/api/checkout/route.js
import { NextResponse } from 'next/server';
import { createOrder, getAllOrders } from '@/lib/orderDb';

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await createOrder(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete order checkout.' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, total: orders.length, orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
