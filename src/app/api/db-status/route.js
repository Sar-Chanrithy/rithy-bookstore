// src/app/api/db-status/route.js
import { NextResponse } from 'next/server';
import { isPostgresConfigured, testConnection } from '@/lib/postgres';

export async function GET() {
  const configured = isPostgresConfigured();
  
  if (!configured) {
    return NextResponse.json({
      status: 'file_system',
      message: 'PostgreSQL environment variables are not set. Running on local JSON Database (src/data/books.json).',
      postgresConfigured: false,
    });
  }

  const test = await testConnection();
  if (test.ok) {
    return NextResponse.json({
      status: 'connected',
      message: 'Successfully connected to PostgreSQL database!',
      postgresConfigured: true,
      serverTime: test.time,
    });
  }

  return NextResponse.json({
    status: 'error',
    message: 'PostgreSQL is configured in .env.local, but connection failed.',
    postgresConfigured: true,
    error: test.error,
  }, { status: 500 });
}
