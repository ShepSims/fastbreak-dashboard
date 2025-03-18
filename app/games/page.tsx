'use client'

import { getSession } from '@auth0/nextjs-auth0';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAllTeams, getGames } from '@/lib/nba-api';
import { Game } from '@/types/player';
import { format, subDays } from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { /* theme */ } = useTheme(); // Unused but kept for future use
  const [session, setSession] = useState<unknown | null>(null);
  const [teams, setTeams] = useState<Array<any>>([]);
  const [gamesData, setGamesData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Current filter states (temporary until search is clicked)
  const [teamFilter, setTeamFilter] = useState<number | null>(searchParams.team ? parseInt(searchParams.team) : null);
  const [seasonFilter, setSeasonFilter] = useState<number | null>(null);
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
  
  useEffect(() => {
    async function initialize() {
      setLoading(true);
      
      try {
        // Get session
        const userSession = await getSession();
        setSession(userSession);
        
        if (!userSession) {
          redirect('/');
          return;
        }
        
        // Get teams
        const allTeams = await getAllTeams();
        setTeams(allTeams);
        
        // Initialize filter states from URL
        setTeamFilter(selectedTeamId);
        setSeasonFilter(selectedSeason);
        setPostseasonFilter(searchParams.postseason || null);
        setStatusFilter(gameStatus);
        
        // Fetch games data
        const params: {
          page: number;
          perPage: number;
          seasons: number[];
          teamIds?: number[];
          postseason?: boolean;
        } = {
          page: page,
          perPage: 25,
          seasons: [selectedSeason]
        };
        
        if (selectedTeamId) {
          params.teamIds = [selectedTeamId];
        }
        
        // Add postseason filter if specified
        if (isPostseason !== null) {
          params.postseason = isPostseason;
        }
        
        const data = await getGames(params);
        console.log('Games data received:', data);
        setGamesData(data);
      } catch (err) {
        console.error('Error in initialize:', err);
        // Set gamesData to empty object to allow rendering without data
        setGamesData({ data: [], meta: { per_page: 25 } });
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false);
      }
    }
    
    initialize();
  }, [
    searchParams, 
    selectedTeamId, 
    selectedSeason, 
    isPostseason, 
    gameStatus, 
    page
  ]);
  
  // Function to apply all filters when search button is clicked
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (teamFilter) {
      params.set('team', teamFilter.toString());
    }
    
    if (seasonFilter) {
      params.set('season', seasonFilter.toString());
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
      <h1 className="text-3xl font-bold mb-8 flex items-center" style={{ color: 'var(--foreground)' }}>
        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">NBA Games</span>
        <span className="text-lg font-medium ml-3 px-3 py-1 rounded-full" style={{ 
          color: 'var(--secondary)',
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)'
        }}>
          {selectedSeason}-{selectedSeason+1} Season
        </span>
      </h1>

      {/* Enhanced Filters */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-lg" 
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--card-border)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))'
        }}>
        <div className="p-5">
          <h2 className="text-lg font-medium mb-5" style={{ color: 'var(--foreground)' }}>Filter Games</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Team Filter */}
            <div>
              <label htmlFor="team-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Team
              </label>
              <select
                id="team-select"
                value={teamFilter || ''}
                onChange={(e) => setTeamFilter(e.target.value ? parseInt(e.target.value) : null)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm rounded-md transition-colors duration-150"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-text)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
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
              <label htmlFor="season-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Season
              </label>
              <select
                id="season-select"
                value={seasonFilter || selectedSeason}
                onChange={(e) => setSeasonFilter(parseInt(e.target.value))}
                className="block w-full pl-3 pr-10 py-2.5 text-sm rounded-md transition-colors duration-150"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-text)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                {availableSeasons.map((year) => (
                  <option key={year} value={year}>
                    {year}-{year + 1}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Game Status */}
            <div>
              <label htmlFor="status-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Game Status
              </label>
              <select
                id="status-select"
                value={statusFilter || ''}
                onChange={(e) => setStatusFilter(e.target.value || null)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm rounded-md transition-colors duration-150"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-text)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
              >
                <option value="">All Statuses</option>
                <option value="Final">Final</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>
            
            {/* Postseason Filter */}
            <div>
              <label htmlFor="postseason-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--foreground)' }}>
                Game Type
              </label>
              <select
                id="postseason-select"
                value={postseasonFilter || ''}
                onChange={(e) => setPostseasonFilter(e.target.value || null)}
                className="block w-full pl-3 pr-10 py-2.5 text-sm rounded-md transition-colors duration-150"
                style={{ 
                  backgroundColor: 'var(--input-bg)', 
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-text)',
                  borderWidth: '1px',
                  borderStyle: 'solid'
                }}
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
              className="inline-flex justify-center items-center px-5 py-2.5 border rounded-md text-sm font-medium shadow-sm transition-all duration-150 hover:shadow"
              style={{ 
                backgroundColor: 'var(--primary)', 
                borderColor: 'var(--primary-hover)',
                color: 'white' 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search Games
            </button>
            
            <Link
              href="/games"
              className="inline-flex justify-center items-center px-5 py-2.5 border rounded-md text-sm font-medium shadow-sm transition-all duration-150 hover:shadow"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)' 
              }}
            >
              Clear All Filters
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="shadow-lg overflow-hidden rounded-lg p-10 text-center" style={{ 
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))'
        }}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-10 mb-4 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
            <p style={{ color: 'var(--secondary)' }}>Loading games data...</p>
          </div>
        </div>
      ) : !gamesData || !filteredGames || !Array.isArray(filteredGames) ? (
        <div className="shadow-lg overflow-hidden rounded-lg p-10 text-center" style={{ 
          backgroundColor: 'var(--card-bg)',
          boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--error)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p style={{ color: 'var(--error)' }}>Error loading games data. Please try again later.</p>
        </div>
      ) : (
        <>
          <div className="shadow-lg overflow-hidden rounded-lg" style={{ 
            backgroundColor: 'var(--card-bg)',
            boxShadow: 'var(--card-shadow, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))'
          }}>
            <div className="px-6 py-5 sm:px-6">
              <h2 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                {selectedTeamId && teams.length > 0
                  ? `Games for ${teams.find(t => t.id === selectedTeamId)?.full_name}`
                  : 'All NBA Games'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm" style={{ color: 'var(--secondary)' }}>
                Showing {filteredGames.length} of {gamesData.data?.length || 0} games
              </p>
            </div>
            <div style={{ borderTop: `1px solid var(--table-border)` }}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y" style={{ borderColor: 'var(--table-border)' }}>
                  <thead style={{ backgroundColor: 'var(--table-header)' }}>
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Date
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Home Team
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Score
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Visitor Team
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--secondary)' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--table-border)'
                  }}>
                    {filteredGames.map((game: Game) => (
                      <tr 
                        key={game.id} 
                        className="hover:bg-opacity-75 transition-colors duration-150"
                        style={{ backgroundColor: 'var(--card-bg)' }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--foreground)' }}>
                          {formatGameDate(game.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {game.home_team.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: 'var(--secondary)' }}>
                          {game.status === 'Final' ? (
                            <span className="font-bold">
                              <span style={{ color: game.home_team_score > game.visitor_team_score ? 'var(--primary)' : 'var(--foreground)' }}>
                                {game.home_team_score}
                              </span>
                              {' - '}
                              <span style={{ color: game.visitor_team_score > game.home_team_score ? 'var(--primary)' : 'var(--foreground)' }}>
                                {game.visitor_team_score}
                              </span>
                            </span>
                          ) : (
                            `${game.home_team_score} - ${game.visitor_team_score}`
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                          {game.visitor_team.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--secondary)' }}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            game.status === 'Final' 
                              ? 'bg-green-100 text-green-800' 
                              : game.status === 'In Progress' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {game.status}
                          </span>
                          {game.postseason && 
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Playoff
                            </span>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/games/${game.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white transition-colors duration-150 hover:bg-blue-700"
                            style={{ backgroundColor: 'var(--primary)' }}
                          >
                            View Details
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
          <div className="mt-8 flex justify-between items-center">
            <Link
              href={(() => {
                const params = new URLSearchParams();
                if (selectedTeamId) params.set('team', selectedTeamId.toString());
                if (selectedSeason && selectedSeason !== season) params.set('season', selectedSeason.toString());
                if (isPostseason !== null) params.set('postseason', isPostseason.toString());
                if (gameStatus) params.set('status', gameStatus);
                params.set('page', Math.max(1, page - 1).toString());
                return `/games?${params.toString()}`;
              })()}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium shadow-sm transition-all duration-150 hover:shadow ${page <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)' 
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Previous
            </Link>
            <span className="text-sm px-4 py-2 rounded-md" style={{ 
              color: 'var(--foreground)',
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--card-border)'
            }}>
              Page {page} of {Math.ceil((gamesData.meta?.total_count || gamesData.data?.length || 25) / (gamesData.meta?.per_page || 25))}
            </span>
            <Link
              href={(() => {
                const params = new URLSearchParams();
                if (selectedTeamId) params.set('team', selectedTeamId.toString());
                if (selectedSeason && selectedSeason !== season) params.set('season', selectedSeason.toString());
                if (isPostseason !== null) params.set('postseason', isPostseason.toString());
                if (gameStatus) params.set('status', gameStatus);
                params.set('page', (page + 1).toString());
                return `/games?${params.toString()}`;
              })()}
              className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium shadow-sm transition-all duration-150 hover:shadow ${page >= Math.ceil((gamesData.meta?.total_count || gamesData.data?.length || 25) / (gamesData.meta?.per_page || 25)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)' 
              }}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </>
      )}
    </>
  );
} 