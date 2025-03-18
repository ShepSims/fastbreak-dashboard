import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getGameById } from '@/lib/nba-api';
import { format } from 'date-fns';

export default async function GamePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getSession();
  
  // Redirect unauthenticated users to the home page
  if (!session) {
    redirect('/');
  }

  const gameId = parseInt(params.id);

  // Fetch game data
  let game;
  try {
    game = await getGameById(gameId);
  } catch (err) {
    console.error('Error fetching game details:', err);
    return <div className="text-red-500 p-4">Failed to load game details</div>;
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center max-w-md">
          <p className="text-red-500">Game not found. The game may not exist or there was an error loading its data.</p>
          <Link 
            href="/games" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Games
          </Link>
        </div>
      </div>
    );
  }

  // Format date
  const formatGameDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Determine winner
  const homeTeamWon = game.home_team_score > game.visitor_team_score;
  const isGameCompleted = game.status === 'Final';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
                  FastBreak
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link 
                  href="/dashboard" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/players" 
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Players
                </Link>
                <Link 
                  href="/games" 
                  className="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Games
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link 
                href="/api/auth/logout" 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Log out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {game.home_team.full_name} vs {game.visitor_team.full_name}
            </h1>
            <p className="text-lg text-gray-600">
              {formatGameDate(game.date)} • Season {game.season}
            </p>
          </div>
          <Link
            href="/games"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Games
          </Link>
        </div>

        {/* Game Score Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Game Score</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {game.status}
              {isGameCompleted && ' • Final'}
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
              <div className={`bg-gray-50 p-6 rounded-lg text-center ${isGameCompleted && homeTeamWon ? 'ring-2 ring-green-500' : ''}`}>
                <div className="text-xl font-medium text-gray-900 mb-2">{game.home_team.full_name}</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{game.home_team_score}</div>
                <div className="text-sm text-gray-500">{game.home_team.conference}ern Conference</div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-400">VS</div>
              </div>
              
              <div className={`bg-gray-50 p-6 rounded-lg text-center ${isGameCompleted && !homeTeamWon ? 'ring-2 ring-green-500' : ''}`}>
                <div className="text-xl font-medium text-gray-900 mb-2">{game.visitor_team.full_name}</div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{game.visitor_team_score}</div>
                <div className="text-sm text-gray-500">{game.visitor_team.conference}ern Conference</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Game Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about this matchup.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatGameDate(game.date)}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Season</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {game.season}-{game.season + 1}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {game.status}
                  {game.time && ` (${game.time})`}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Period</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {game.period === 0 ? 'Not Started' : 
                   game.period === 4 && game.status === 'Final' ? 'Final' : 
                   `Quarter ${game.period}`}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Postseason</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {game.postseason ? 'Yes' : 'No'}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Home Team</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link 
                    href={`/players?team=${game.home_team.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {game.home_team.full_name} ({game.home_team.abbreviation})
                  </Link>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Visitor Team</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link 
                    href={`/players?team=${game.visitor_team.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {game.visitor_team.full_name} ({game.visitor_team.abbreviation})
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 