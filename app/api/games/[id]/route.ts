import { NextRequest, NextResponse } from 'next/server';
import { getGameById } from '@/lib/nba-api';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const gameId = parseInt(params.id);

  if (isNaN(gameId)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid game ID'
      },
      { status: 400 }
    );
  }

  try {
    const gameData = await getGameById(gameId);
    
    return NextResponse.json({
      success: true,
      data: gameData
    });
  } catch (error) {
    console.error('Error in game details API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch game data',
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 