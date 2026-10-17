// src/app/api/stats/route.js
import { NextResponse } from 'next/server';
import { getDbStats } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getDbStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
