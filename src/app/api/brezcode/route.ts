import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'OK',
    service: 'BrezCode API',
    endpoints: [
      '/api/brezcode/assessment',
      '/api/brezcode/health-profile',
      '/api/brezcode/recommendations'
    ],
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    status: 'received',
    message: 'BrezCode data processed',
    data: body,
    timestamp: new Date().toISOString()
  });
}