import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { mockTeamData } from '@/lib/mockData';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Return mock player data
    return NextResponse.json(mockTeamData);
  } catch (error) {
    console.error('[Players API] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 