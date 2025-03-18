import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    console.log('[Profile Update] Session:', session);

    if (!session?.user) {
      console.log('[Profile Update] No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      console.log('[Profile Update] No name provided');
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Here you would typically update the user's profile in your database
    // For now, we'll just log the update
    console.log('[Profile Update] Updating profile for user:', session.user.email);
    console.log('[Profile Update] New name:', name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Profile Update] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 