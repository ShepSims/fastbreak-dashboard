import { NextRequest, NextResponse } from 'next/server';
import { getGames } from '@/lib/nba-api';

interface GamesParams {
  page: number;
  perPage: number;
  seasons: number[];
  teamIds?: number[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const perPage = parseInt(searchParams.get('perPage') || '25');
  const season = parseInt(searchParams.get('season') || '2023'); // Default to 2023-2024 season
  const teamId = searchParams.get('teamId');

  try {
    const params: GamesParams = {
      page: page,
      perPage: perPage,
      seasons: [season]
    };
    
    if (teamId) {
      params.teamIds = [parseInt(teamId)];
    }
    
    const gamesData = await getGames(params);
    
    return NextResponse.json({
      success: true,
      data: gamesData.data,
      meta: gamesData.meta,
      season,
    });
  } catch (error) {
    console.error('Error in games API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch games data',
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 