import { NextResponse } from 'next/server';
import { workspaceData } from '@/data/workspaceData';

export async function GET() {
  console.log('API route called');
  try {
    // Add CORS headers
    return new NextResponse(JSON.stringify(workspaceData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch workspace data' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 