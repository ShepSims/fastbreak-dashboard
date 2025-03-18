import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAllTeams, processTeamData } from '@/lib/nba-api';
import TeamSelector from '@/app/components/dashboard/TeamSelector';

export default async function PlayersPage({ 
  searchParams 
}: { 
  searchParams: { team?: string } 
}) {
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
  const selectedTeamId = searchParams?.team ? parseInt(searchParams.team) : 4; // Default to Charlotte Hornets (ID 4)
  
  // Fetch data for the selected team
  let teamData;
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

      {teamData ? (
        <>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {teamData.team.full_name} Players
          </h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Roster</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {season}-{season+1} Season
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Player
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PPG
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RPG
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        APG
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FG%
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        3P%
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {teamData.players.map((player) => (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {player.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.position || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats ? player.stats.pts.toFixed(1) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats ? player.stats.reb.toFixed(1) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats ? player.stats.ast.toFixed(1) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats ? (player.stats.fg_pct * 100).toFixed(1) + '%' : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {player.stats ? (player.stats.fg3_pct * 100).toFixed(1) + '%' : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/players/${player.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
          <p className="text-red-500">Error loading team data. Please try again later.</p>
        </div>
      )}
    </>
  );
} 