import { redirect } from 'next/navigation';
import React from 'react';
import { getSession } from '@auth0/nextjs-auth0';
import { getAllTeams, processTeamData } from '@/lib/nba-api';
import TeamSelector from '@/app/components/dashboard/TeamSelector';
import PlayerLeaderboard from '@/components/dashboard/PlayerLeaderboard';
import ShootingEfficiency from '@/components/dashboard/ShootingEfficiency';
import PointsDistribution from '@/components/dashboard/PointsDistribution';
import PerformanceRadarChart from '@/components/dashboard/PerformanceRadarChart';
import { TeamData } from '@/types/player';

export default async function Dashboard({ 
  searchParams 
}: { 
  searchParams: { team?: string } 
}) {
  const session = await getSession();
  
  // Redirect unauthenticated users to the home page
  if (!session) {
    redirect('/');
  }

  // Get current NBA season (or use the most recent completed season if it's off-season)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // NBA season typically runs from October to June
  // If we're in July-September, use the previous season
  const season = currentMonth >= 7 && currentMonth <= 9 ? currentYear - 1 : currentYear;
  
  // Get all teams
  const teams = await getAllTeams();
  
  // Default to the first team or use the team from the query params
  const selectedTeamId = searchParams.team ? parseInt(searchParams.team) : 4; // Default to Charlotte Hornets (ID 4)
  
  // Fetch data for the selected team
  let teamData: TeamData | undefined;
  try {
    teamData = await processTeamData(selectedTeamId, season);
  } catch (error) {
    console.error('Error fetching team data:', error);
    // We'll handle this in the UI
  }

  return (
    <>
      {/* Team Selector */}
      <div className="mb-8">
        <TeamSelector teams={teams} selectedTeamId={selectedTeamId} />
      </div>

      {teamData && (
        <h1 style={{ color: 'var(--foreground)' }} className="text-3xl font-bold mb-8">
          {teamData.team.full_name} Dashboard
          <span className="text-lg font-normal ml-2" style={{ color: 'var(--secondary)' }}>
            {season}-{season+1} Season
          </span>
        </h1>
      )}

      {!teamData ? (
        <div className="shadow overflow-hidden sm:rounded-lg p-8 text-center" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)', borderColor: 'var(--card-border)' }}>
          <p style={{ color: 'var(--error)' }}>Error loading team data. Please try again later.</p>
        </div>
      ) : (
        <>
          {/* Team Stats Overview */}
          {teamData.teamStanding && (
            <div className="shadow overflow-hidden sm:rounded-lg mb-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Team Standing</h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                  Current standings in the {teamData.team.conference}ern conference
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)' }} className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--table-header)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Conference Rank</div>
                    <div className="mt-1 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {teamData.teamStanding.conference_rank}
                      <span className="text-sm ml-1" style={{ color: 'var(--secondary)' }}>
                        of 15
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--table-header)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Season Record</div>
                    <div className="mt-1 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {teamData.teamStanding.wins}-{teamData.teamStanding.losses}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--table-header)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Home Record</div>
                    <div className="mt-1 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {teamData.teamStanding.home_record}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--table-header)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--secondary)' }}>Away Record</div>
                    <div className="mt-1 text-3xl font-semibold" style={{ color: 'var(--foreground)' }}>
                      {teamData.teamStanding.road_record}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Player Leaderboard */}
            <div className="shadow overflow-hidden sm:rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Player Leaderboard</h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                  Top performers in key statistical categories
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)' }}>
                <PlayerLeaderboard players={teamData.players} />
              </div>
            </div>

            {/* Shooting Efficiency */}
            <div className="shadow overflow-hidden sm:rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Shooting Efficiency</h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                  Field goal and 3-point percentages
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)' }} className="p-4">
                <ShootingEfficiency players={teamData.players} />
              </div>
            </div>

            {/* Performance Radar Chart */}
            <div className="shadow overflow-hidden sm:rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Player Performance</h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                  Multi-stat comparison for selected players
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)' }} className="p-4">
                <PerformanceRadarChart players={teamData.players} />
              </div>
            </div>

            {/* Points Distribution */}
            <div className="shadow overflow-hidden sm:rounded-lg" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>Points Distribution</h2>
                <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                  Points per game for all players
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--card-border)' }} className="p-4">
                <PointsDistribution players={teamData.players} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 