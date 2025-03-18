import { NextRequest, NextResponse } from 'next/server';
import { getPlayerById, getPlayerStats } from '@/lib/nba-api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const playerId = parseInt(params.id);
  const searchParams = request.nextUrl.searchParams;
  const season = parseInt(searchParams.get('season') || '2023'); // Default to 2023-2024 season

  if (isNaN(playerId)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Invalid player ID'
      },
      { status: 400 }
    );
  }

  try {
    const playerData = await getPlayerById(playerId);
    const playerStats = await getPlayerStats(playerId, season);
    
    return NextResponse.json({
      success: true,
      data: {
        player: playerData,
        stats: playerStats
      },
      season,
    });
  } catch (error) {
    console.error('Error in player API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch player data',
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 