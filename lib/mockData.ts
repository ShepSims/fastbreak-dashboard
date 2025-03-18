import { TeamStats } from '@/types/player';

export const mockTeamData: TeamStats = {
  teamName: "Charlotte Hornets",
  season: "2023-24",
  players: [
    {
      id: 1,
      name: "LaMelo Ball",
      position: "PG",
      number: 1,
      height: "6'7\"",
      weight: 180,
      stats: {
        gamesPlayed: 58,
        minutesPerGame: 32.3,
        pointsPerGame: 23.9,
        reboundsPerGame: 5.1,
        assistsPerGame: 8.0,
        fieldGoalPercentage: 43.3,
        threePointPercentage: 35.5,
        freeThrowPercentage: 86.7,
        stealsPerGame: 1.8,
        blocksPerGame: 0.3
      }
    },
    {
      id: 2,
      name: "Terry Rozier",
      position: "SG",
      number: 3,
      height: "6'1\"",
      weight: 190,
      stats: {
        gamesPlayed: 61,
        minutesPerGame: 35.7,
        pointsPerGame: 23.2,
        reboundsPerGame: 3.9,
        assistsPerGame: 6.6,
        fieldGoalPercentage: 45.9,
        threePointPercentage: 36.1,
        freeThrowPercentage: 84.5,
        stealsPerGame: 1.1,
        blocksPerGame: 0.3
      }
    },
    {
      id: 3,
      name: "Miles Bridges",
      position: "SF",
      number: 0,
      height: "6'6\"",
      weight: 225,
      stats: {
        gamesPlayed: 52,
        minutesPerGame: 37.0,
        pointsPerGame: 21.0,
        reboundsPerGame: 7.3,
        assistsPerGame: 3.3,
        fieldGoalPercentage: 46.1,
        threePointPercentage: 34.8,
        freeThrowPercentage: 84.2,
        stealsPerGame: 1.0,
        blocksPerGame: 0.8
      }
    },
    {
      id: 4,
      name: "PJ Washington",
      position: "PF",
      number: 25,
      height: "6'7\"",
      weight: 230,
      stats: {
        gamesPlayed: 64,
        minutesPerGame: 32.4,
        pointsPerGame: 13.6,
        reboundsPerGame: 5.3,
        assistsPerGame: 2.2,
        fieldGoalPercentage: 44.4,
        threePointPercentage: 32.1,
        freeThrowPercentage: 73.8,
        stealsPerGame: 0.8,
        blocksPerGame: 1.2
      }
    },
    {
      id: 5,
      name: "Mark Williams",
      position: "C",
      number: 5,
      height: "7'0\"",
      weight: 242,
      stats: {
        gamesPlayed: 43,
        minutesPerGame: 26.8,
        pointsPerGame: 12.7,
        reboundsPerGame: 9.4,
        assistsPerGame: 1.2,
        fieldGoalPercentage: 63.7,
        threePointPercentage: 0,
        freeThrowPercentage: 68.9,
        stealsPerGame: 0.5,
        blocksPerGame: 1.7
      }
    }
  ]
}; 