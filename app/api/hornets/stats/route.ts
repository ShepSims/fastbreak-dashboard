import { NextRequest, NextResponse } from 'next/server';
import { processHornetsData } from '@/lib/nba-api';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const season = parseInt(searchParams.get('season') || '2023'); // Default to 2023-2024 season

  try {
    const hornetsData = await processHornetsData(season);
    
    return NextResponse.json({
      success: true,
      data: hornetsData,
      season,
    });
  } catch (error) {
    console.error('Error in Hornets stats API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch Hornets data',
        message: (error as Error).message 
      },
      { status: 500 }
    );
  }
} 