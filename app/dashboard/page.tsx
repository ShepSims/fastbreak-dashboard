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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {teamData.team.full_name} Dashboard
          <span className="text-lg font-normal text-gray-500 ml-2">
            {season}-{season+1} Season
          </span>
        </h1>
      )}

      {!teamData ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
          <p className="text-red-500">Error loading team data. Please try again later.</p>
        </div>
      ) : (
        <>
          {/* Team Stats Overview */}
          {teamData.teamStanding && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Team Standing</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Current standings in the {teamData.team.conference}ern conference
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Conference Rank</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      {teamData.teamStanding.conference_rank}
                      <span className="text-sm text-gray-500 ml-1">
                        of 15
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Season Record</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      {teamData.teamStanding.wins}-{teamData.teamStanding.losses}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Home Record</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      {teamData.teamStanding.home_record}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Away Record</div>
                    <div className="mt-1 text-3xl font-semibold text-gray-900">
                      {teamData.teamStanding.road_record}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Player Leaderboard */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Player Leaderboard</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Top performers in key statistical categories
                </p>
              </div>
              <div className="border-t border-gray-200">
                <PlayerLeaderboard players={teamData.players} />
              </div>
            </div>

            {/* Shooting Efficiency */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Shooting Efficiency</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Field goal and 3-point percentages
                </p>
              </div>
              <div className="border-t border-gray-200 p-4">
                <ShootingEfficiency players={teamData.players} />
              </div>
            </div>

            {/* Performance Radar Chart */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Player Performance</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Multi-stat comparison for selected players
                </p>
              </div>
              <div className="border-t border-gray-200 p-4">
                <PerformanceRadarChart players={teamData.players} />
              </div>
            </div>

            {/* Points Distribution */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Points Distribution</h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Points per game for all players
                </p>
              </div>
              <div className="border-t border-gray-200 p-4">
                <PointsDistribution players={teamData.players} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
} 