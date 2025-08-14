import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'OK',
    service: 'Avatar Training API',
    endpoints: [
      '/api/avatar/training',
      '/api/avatar/chat',
      '/api/avatar/knowledge'
    ],
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    status: 'received',
    message: 'Avatar training data processed',
    data: body,
    timestamp: new Date().toISOString()
  });
}