import { NextRequest, NextResponse } from 'next/server';
import { processTeamData } from '@/lib/nba-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const teamId = parseInt(searchParams.get('teamId') || '4'); // Default to Hornets (ID 4)
  const season = parseInt(searchParams.get('season') || '2023'); // Default to 2023-2024 season

  try {
    const teamData = await processTeamData(teamId, season);
    
    return NextResponse.json({
      success: true,
      data: teamData,
      teamId,
      season,
    });
  } catch (error) {
    console.error('Error in team stats API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch team data',
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 