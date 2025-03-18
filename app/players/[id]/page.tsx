import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPlayerById, getPlayerStats } from '@/lib/nba-api';
import { PlayerStats } from '@/types/player';

export default async function PlayerPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getSession();
  
  // Redirect unauthenticated users to the home page
  if (!session) {
    redirect('/');
  }

  const playerId = parseInt(params.id);

  // Get current NBA season (or use the most recent completed season if it's off-season)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // NBA season typically runs from October to June
  // If we're in July-September, use the previous season
  const season = currentMonth >= 7 && currentMonth <= 9 ? currentYear - 1 : currentYear;
  
  // Fetch player data
  let player;
  let playerStats: PlayerStats | null = null;
  try {
    player = await getPlayerById(playerId);
    playerStats = await getPlayerStats(playerId, season);
  } catch (error) {
    console.error('Error fetching player data:', error);
    // We'll handle this in the UI
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center max-w-md">
          <p className="text-red-500">Player not found. The player may not exist or there was an error loading their data.</p>
          <Link 
            href="/players" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Players
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {player.first_name} {player.last_name}
            </h1>
            <p className="text-lg text-gray-600">
              {player.team.full_name} | #{player.jersey_number || 'N/A'} | {player.position || 'N/A'}
            </p>
          </div>
          <Link
            href={`/players?team=${player.team.id}`}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Team Roster
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Player Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and attributes.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.first_name} {player.last_name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Team</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.team.full_name}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Position</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.position || 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Height</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.height_feet ? `${player.height_feet}'${player.height_inches || 0}"` : 'N/A'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {player.weight_pounds ? `${player.weight_pounds} lbs` : 'N/A'}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {playerStats ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Season Statistics</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {season}-{season+1} NBA Season
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Games Played</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.games_played}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Minutes</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.min || 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Points Per Game</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.pts.toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Rebounds Per Game</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.reb.toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Assists Per Game</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.ast.toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Steals Per Game</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.stl.toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Blocks Per Game</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {playerStats.blk.toFixed(1)}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Field Goal %</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {(playerStats.fg_pct * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">3-Point %</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {(playerStats.fg3_pct * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Free Throw %</div>
                  <div className="mt-1 text-3xl font-semibold text-gray-900">
                    {(playerStats.ft_pct * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
            <p className="text-red-500">Error loading player statistics. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
} 