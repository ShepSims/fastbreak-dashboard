export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height_feet?: number;
  height_inches?: number;
  weight_pounds?: number;
  team: {
    id: number;
    abbreviation: string;
    city: string;
    conference: string;
    division: string;
    full_name: string;
    name: string;
  };
}

export interface Team {
  id: number;
  abbreviation: string;
  city: string;
  conference: string;
  division: string;
  full_name: string;
  name: string;
}

export interface PlayerStats {
  player_id: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  fg_pct: number;
  fg3_pct: number;
  ft_pct: number;
  min: string;
  games_played: number;
  season: number;
}

export interface PlayerWithStats {
  id: number;
  name: string;
  position: string;
  stats: PlayerStats | null;
}

export interface TeamStats {
  teamName: string;
  season: string;
  players: PlayerWithStats[];
}

export interface TeamStanding {
  team: {
    id: number;
    conference: string;
    division: string;
    city: string;
    name: string;
    full_name: string;
    abbreviation: string;
  };
  conference_record: string;
  conference_rank: number;
  division_record: string;
  division_rank: number;
  wins: number;
  losses: number;
  home_record: string;
  road_record: string;
  season: number;
}

export interface Game {
  id: number;
  date: string;
  home_team: Team;
  home_team_score: number;
  period: number;
  postseason: boolean;
  season: number;
  status: string;
  time: string;
  visitor_team: Team;
  visitor_team_score: number;
}

export interface GameDetails extends Game {
  // Any additional details that might be needed for the game detail view
}

export interface TeamData {
  players: PlayerWithStats[];
  teamStanding: TeamStanding | null;
  team: Team;
}

// For backward compatibility, keep HornetsData as an alias to TeamData
export type HornetsData = TeamData; 