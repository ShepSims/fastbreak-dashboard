import { BalldontlieAPI } from "@balldontlie/sdk";
import { PlayerWithStats, TeamStanding, HornetsData, Team, Game, GameDetails, PlayerStats } from '@/types/player';

// Initialize the API client with the API key from environment variables
const api = new BalldontlieAPI({ 
  apiKey: process.env.BALLDONTLIE_API_KEY || ''
});

// Mock data for season averages (since it's GOAT tier only)
const generateMockSeasonAverages = (playerId: number, playerPosition: string, season: number) => {
  // Generate position-appropriate stats
  let statRanges = {
    pts: { min: 5, max: 25 },
    reb: { min: 1, max: 12 },
    ast: { min: 0.5, max: 10 },
    stl: { min: 0.2, max: 2.5 },
    blk: { min: 0.1, max: 2.5 },
    fg_pct: { min: 0.38, max: 0.55 },
    fg3_pct: { min: 0.28, max: 0.43 },
  };

  // Adjust stats based on position
  switch (playerPosition) {
    case 'G': // Guards
      statRanges.pts.max = 30; // More scoring
      statRanges.ast.max = 12; // More assists
      statRanges.reb.max = 6; // Fewer rebounds
      statRanges.fg3_pct.max = 0.45; // Better 3PT shooting
      break;
    case 'F': // Forwards
      statRanges.pts.max = 27; // Good scoring
      statRanges.reb.max = 10; // Good rebounding
      statRanges.blk.max = 2.0; // Moderate blocking
      break;
    case 'C': // Centers
      statRanges.pts.min = 8; // Moderate scoring
      statRanges.reb.min = 6; // Strong rebounding
      statRanges.reb.max = 15;
      statRanges.blk.max = 3.0; // Better shot blocking
      statRanges.fg3_pct.max = 0.33; // Lower 3PT shooting
      statRanges.fg_pct.min = 0.48; // Higher FG% (closer to basket)
      break;
  }

  return {
    player_id: playerId,
    season,
    games_played: Math.floor(Math.random() * (82 - 60) + 60), // 60-82 games
    min: `${Math.floor(Math.random() * (36 - 12) + 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`, // 12-36 minutes
    pts: parseFloat((Math.random() * (statRanges.pts.max - statRanges.pts.min) + statRanges.pts.min).toFixed(1)),
    reb: parseFloat((Math.random() * (statRanges.reb.max - statRanges.reb.min) + statRanges.reb.min).toFixed(1)),
    ast: parseFloat((Math.random() * (statRanges.ast.max - statRanges.ast.min) + statRanges.ast.min).toFixed(1)),
    stl: parseFloat((Math.random() * (statRanges.stl.max - statRanges.stl.min) + statRanges.stl.min).toFixed(1)),
    blk: parseFloat((Math.random() * (statRanges.blk.max - statRanges.blk.min) + statRanges.blk.min).toFixed(1)),
    fg_pct: parseFloat((Math.random() * (statRanges.fg_pct.max - statRanges.fg_pct.min) + statRanges.fg_pct.min).toFixed(3)),
    fg3_pct: parseFloat((Math.random() * (statRanges.fg3_pct.max - statRanges.fg3_pct.min) + statRanges.fg3_pct.min).toFixed(3)),
    ft_pct: parseFloat((Math.random() * (0.95 - 0.65) + 0.65).toFixed(3)), // 65-95% FT
  };
};

// Mock data for team standings (since it's GOAT tier only)
const generateMockStandings = (teamId: number, teamInfo: any, season: number): TeamStanding => {
  // Generate random but realistic win-loss records
  const wins = Math.floor(Math.random() * 41) + 20; // Between 20-60 wins
  const losses = 82 - wins;
  const homeWins = Math.floor(wins * 0.6); // More wins at home
  const homeLosses = 41 - homeWins;
  const roadWins = wins - homeWins;
  const roadLosses = losses - homeLosses;
  
  // Generate conference records
  const conferenceGames = 52; // Each team plays 52 conference games
  const conferenceWins = Math.floor(wins * (conferenceGames / 82));
  const conferenceLosses = conferenceGames - conferenceWins;
  
  // Generate division records
  const divisionGames = 16; // Each team plays 16 division games
  const divisionWins = Math.floor(wins * (divisionGames / 82));
  const divisionLosses = divisionGames - divisionWins;
  
  // Calculate conference rank (pseudo-random but weighted by win total)
  const conferenceRank = Math.min(15, Math.max(1, 16 - Math.floor(wins / 4)));
  const divisionRank = Math.min(5, Math.max(1, 6 - Math.floor(wins / 12)));

  return {
    team: {
      id: teamId,
      conference: teamInfo.conference,
      division: teamInfo.division,
      city: teamInfo.city,
      name: teamInfo.name,
      full_name: teamInfo.full_name,
      abbreviation: teamInfo.abbreviation
    },
    conference_record: `${conferenceWins}-${conferenceLosses}`,
    conference_rank: conferenceRank,
    division_record: `${divisionWins}-${divisionLosses}`,
    division_rank: divisionRank,
    wins: wins,
    losses: losses,
    home_record: `${homeWins}-${homeLosses}`,
    road_record: `${roadWins}-${roadLosses}`,
    season: season
  };
};

// Get all NBA teams
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const response = await api.nba.getTeams();
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Get a specific team by ID
export const getTeamById = async (teamId: number): Promise<Team> => {
  try {
    const response = await api.nba.getTeam(teamId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team ${teamId}:`, error);
    throw error;
  }
};

// Get player by ID
export const getPlayerById = async (playerId: number) => {
  try {
    const response = await api.nba.getPlayer(playerId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player ${playerId}:`, error);
    throw error;
  }
};

// Get player stats by ID
export const getPlayerStats = async (playerId: number, season: number) => {
  try {
    // Try to get real stats first
    try {
      const response = await api.nba.getSeasonAverages({
        season: season,
        player_id: playerId,
      });
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
    } catch (error) {
      console.log('Using mock stats for player (free tier limitation)');
    }
    
    // If real stats fail or return empty, use mock data
    // First get the player to determine position
    const playerData = await getPlayerById(playerId);
    return generateMockSeasonAverages(playerId, playerData.position, season);
  } catch (error) {
    console.error(`Error fetching stats for player ${playerId}:`, error);
    throw error;
  }
};

// Get games with pagination
export const getGames = async (params: {
  page?: number;
  perPage?: number;
  dates?: string[];
  seasons?: number[];
  teamIds?: number[];
}) => {
  try {
    const response = await api.nba.getGames({
      cursor: params.page,
      per_page: params.perPage || 25,
      dates: params.dates,
      seasons: params.seasons,
      team_ids: params.teamIds
    });
    console.log('response', {
      cursor: params.page,
      per_page: params.perPage || 25,
      dates: params.dates,
      seasons: params.seasons,
      team_ids: params.teamIds
    });
    return response;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

// Get game by ID
export const getGameById = async (gameId: number): Promise<GameDetails> => {
  try {
    const response = await api.nba.getGame(gameId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    throw error;
  }
};

// Process and transform player data for any team
export const processTeamData = async (teamId: number, season: number): Promise<HornetsData> => {
  try {
    // Get team info
    const teamInfo = await getTeamById(teamId);
    
    // Get all team players
    const playersResponse = await api.nba.getPlayers({
      team_ids: [teamId],
      per_page: 100,
    });
    
    const players = playersResponse.data;
    console.log(`Found ${players.length} players for team ${teamId}`);
    
    // Instead of fetching real stats, generate mock stats for all players
    const playersWithStats: PlayerWithStats[] = players
      .map(player => {
        // Generate mock stats for each player
        const mockStats = generateMockSeasonAverages(player.id, player.position, season);
        
        return {
          id: player.id,
          name: `${player.first_name} ${player.last_name}`,
          position: player.position,
          stats: mockStats,
        };
      })
      .sort((a, b) => {
        if (!a.stats?.pts) return 1;
        if (!b.stats?.pts) return -1;
        return b.stats.pts - a.stats.pts;
      });
    
    console.log(`Generated mock stats for ${playersWithStats.length} players`);
    
    // Try to get team standings - this may fail depending on API tier
    let teamStanding: TeamStanding | null = null;
    
    try {
      const standingsResponse = await api.nba.getStandings({
        season: season,
      });
      
      if (standingsResponse.data && standingsResponse.data.length > 0) {
        const standings = standingsResponse.data;
        teamStanding = standings.find(standing => standing.team.id === teamId) || null;
      }
    } catch (error) {
      console.warn('Using mock standings (free tier limitation)');
      // Generate mock standings data if the API fails or user is on free tier
      teamStanding = generateMockStandings(teamId, teamInfo, season);
    }
    
    return {
      players: playersWithStats,
      teamStanding: teamStanding,
      team: teamInfo
    };
  } catch (error) {
    console.error('Error processing team data:', error);
    throw error;
  }
}; 