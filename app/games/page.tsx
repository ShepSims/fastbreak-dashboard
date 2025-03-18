'use client'

import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAllTeams, getGames } from '@/lib/nba-api';
import TeamSelector from '@/app/components/dashboard/TeamSelector';
import { Game } from '@/types/player';
import { format, subDays, parseISO } from 'date-fns';

export default function GamesPage({ 
  searchParams 
}: { 
  searchParams: { 
    team?: string; 
    page?: string;
    startDate?: string;
    endDate?: string;
    season?: string;
    postseason?: string;
    status?: string;
  } 
}) {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [gamesData, setGamesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Current filter states (temporary until search is clicked)
  const [teamFilter, setTeamFilter] = useState<number | null>(searchParams.team ? parseInt(searchParams.team) : null);
  const [seasonFilter, setSeasonFilter] = useState<number | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');
  const [postseasonFilter, setPostseasonFilter] = useState<string | null>(searchParams.postseason || null);
  const [statusFilter, setStatusFilter] = useState<string | null>(searchParams.status || null);
  
  // Get current NBA season (or use the most recent completed season if it's off-season)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  
  // NBA season typically runs from October to June
  // If we're in July-September, use the previous season
  const season = currentMonth >= 7 && currentMonth <= 9 ? currentYear - 1 : currentYear;
  
  // Parse URL filter parameters
  const selectedTeamId = searchParams.team ? parseInt(searchParams.team) : null;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const selectedSeason = searchParams.season ? parseInt(searchParams.season) : season;
  const isPostseason = searchParams.postseason === 'true' ? true : searchParams.postseason === 'false' ? false : null;
  const gameStatus = searchParams.status || null;
  
  // Date filters - default to last 30 days if not provided
  const endDate = searchParams.endDate ? new Date(searchParams.endDate) : new Date();
  const startDate = searchParams.startDate ? new Date(searchParams.startDate) : subDays(endDate, 30);
  
  // Format dates for API and UI
  const formattedStartDate = format(startDate, 'yyyy-MM-dd');
  const formattedEndDate = format(endDate, 'yyyy-MM-dd');
  
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      
      // // Get session
      // const userSession = await getSession();
      // setSession(userSession);
      
      // if (!userSession) {
      //   redirect('/');
      // }
      
      // Get teams
      const allTeams = await getAllTeams();
      setTeams(allTeams);
      
      // Initialize filter states from URL
      setTeamFilter(selectedTeamId);
      setSeasonFilter(selectedSeason);
      setStartDateFilter(formattedStartDate);
      setEndDateFilter(formattedEndDate);
      setPostseasonFilter(searchParams.postseason || null);
      setStatusFilter(gameStatus);
      
      // Fetch games data
      try {
        const params: any = {
          page: page,
          perPage: 25,
          seasons: [selectedSeason]
        };
        
        if (selectedTeamId) {
          params.teamIds = [selectedTeamId];
        }
        
        // Add date range filter
        params.dates = [formattedStartDate, formattedEndDate];
        
        // Add postseason filter if specified
        if (isPostseason !== null) {
          params.postseason = isPostseason;
        }
        
        const data = await getGames(params);
        setGamesData(data);
      } catch (error) {
        console.error('Error fetching games data:', error);
      }
      
      setLoading(false);
    }
    
    initialize();
  }, [searchParams]);
  
  // Function to apply all filters when search button is clicked
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (teamFilter) {
      params.set('team', teamFilter.toString());
    }
    
    if (seasonFilter) {
      params.set('season', seasonFilter.toString());
    }
    
    if (startDateFilter) {
      params.set('startDate', startDateFilter);
    }
    
    if (endDateFilter) {
      params.set('endDate', endDateFilter);
    }
    
    if (postseasonFilter) {
      params.set('postseason', postseasonFilter);
    }
    
    if (statusFilter) {
      params.set('status', statusFilter);
    }
    
    params.set('page', '1'); // Reset to first page when applying new filters
    
    router.push(`/games?${params.toString()}`);
  };

  // Format the date from API format to a more readable format
  const formatGameDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Generate a range of available seasons (from 2018 to current)
  const availableSeasons = [];
  for (let year = 2018; year <= currentYear; year++) {
    availableSeasons.push(year);
  }
  
  // Filter by status if specified
  const filteredGames = gameStatus && gamesData?.data 
    ? gamesData.data.filter((game: Game) => game.status.toLowerCase().includes(gameStatus.toLowerCase()))
    : gamesData?.data;

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        NBA Games
        <span className="text-lg font-normal text-gray-500 ml-2">
          {selectedSeason}-{selectedSeason+1} Season
        </span>
      </h1>

      {/* Enhanced Filters */}
      <div className="mb-8 bg-white shadow p-4 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Filter Games</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Team Filter */}
          <div>
            <label htmlFor="team-select" className="block text-sm font-medium text-gray-700 mb-1">
              Team
            </label>
            <select
              id="team-select"
              value={teamFilter || ''}
              onChange={(e) => setTeamFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.full_name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Season Filter */}
          <div>
            <label htmlFor="season-select" className="block text-sm font-medium text-gray-700 mb-1">
              Season
            </label>
            <select
              id="season-select"
              value={seasonFilter || selectedSeason}
              onChange={(e) => setSeasonFilter(parseInt(e.target.value))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {availableSeasons.map((year) => (
                <option key={year} value={year}>
                  {year}-{year + 1}
                </option>
              ))}
            </select>
          </div>
          
          {/* Date Range Filters */}
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            />
          </div>
          
          {/* Game Status */}
          <div>
            <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-1">
              Game Status
            </label>
            <select
              id="status-select"
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Final">Final</option>
              <option value="In Progress">In Progress</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>
          
          {/* Postseason Filter */}
          <div>
            <label htmlFor="postseason-select" className="block text-sm font-medium text-gray-700 mb-1">
              Game Type
            </label>
            <select
              id="postseason-select"
              value={postseasonFilter || ''}
              onChange={(e) => setPostseasonFilter(e.target.value || null)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Games</option>
              <option value="false">Regular Season</option>
              <option value="true">Playoffs</option>
            </select>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={applyFilters}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search Games
          </button>
          
          <Link
            href="/games"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear All Filters
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
          <p className="text-gray-500">Loading games data...</p>
        </div>
      ) : !gamesData || !filteredGames ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
          <p className="text-red-500">Error loading games data. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                {selectedTeamId 
                  ? `Games for ${teams.find(t => t.id === selectedTeamId)?.full_name}`
                  : 'All NBA Games'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Showing {filteredGames.length} of {gamesData.data.length || 0} games
              </p>
            </div>
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Home Team
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Visitor Team
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGames.map((game: Game) => (
                      <tr key={game.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatGameDate(game.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {game.home_team.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {game.home_team_score} - {game.visitor_team_score}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {game.visitor_team.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {game.status}
                          {game.postseason && <span className="ml-1 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">Playoff</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/games/${game.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-between">
            <Link
              href={`/games?${new URLSearchParams({
                ...(selectedTeamId && { team: selectedTeamId.toString() }),
                ...(selectedSeason !== season && { season: selectedSeason.toString() }),
                ...(searchParams.startDate && { startDate: searchParams.startDate }),
                ...(searchParams.endDate && { endDate: searchParams.endDate }),
                ...(isPostseason !== null && { postseason: isPostseason.toString() }),
                ...(gameStatus && { status: gameStatus }),
                page: Math.max(1, page - 1).toString()
              }).toString()}`}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </Link>
            <span className="text-sm text-gray-700">
              Page {page} of {Math.ceil((gamesData.data.length || 25) / (gamesData.meta?.per_page || 25))}
            </span>
            <Link
              href={`/games?${new URLSearchParams({
                ...(selectedTeamId && { team: selectedTeamId.toString() }),
                ...(selectedSeason !== season && { season: selectedSeason.toString() }),
                ...(searchParams.startDate && { startDate: searchParams.startDate }),
                ...(searchParams.endDate && { endDate: searchParams.endDate }),
                ...(isPostseason !== null && { postseason: isPostseason.toString() }),
                ...(gameStatus && { status: gameStatus }),
                page: (page + 1).toString()
              }).toString()}`}
              className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${page >= Math.ceil((gamesData.data.length || 25) / (gamesData.meta?.per_page || 25)) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </Link>
          </div>
        </>
      )}
    </>
  );
} 