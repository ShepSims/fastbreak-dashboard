'use client';

import { PlayerWithStats } from '@/types/player';

interface PlayerLeaderboardProps {
  players: PlayerWithStats[];
}

export default function PlayerLeaderboard({ players }: PlayerLeaderboardProps) {
  // Sort players by points for the leaderboard
  const sortedByPoints = [...players]
    .filter(player => player.stats)
    .sort((a, b) => (b.stats?.pts || 0) - (a.stats?.pts || 0))
    .slice(0, 5);

  // Sort players by rebounds
  const sortedByRebounds = [...players]
    .filter(player => player.stats)
    .sort((a, b) => (b.stats?.reb || 0) - (a.stats?.reb || 0))
    .slice(0, 5);

  // Sort players by assists
  const sortedByAssists = [...players]
    .filter(player => player.stats)
    .sort((a, b) => (b.stats?.ast || 0) - (a.stats?.ast || 0))
    .slice(0, 5);

  return (
    <div className="divide-y divide-gray-200">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-medium text-gray-900">Points Leaders</h3>
        <div className="mt-2">
          {sortedByPoints.map((player, index) => (
            <div key={player.id} className="flex justify-between py-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{player.name}</span>
              </div>
              <span className="text-sm text-gray-500">{player.stats?.pts.toFixed(1)} PPG</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-medium text-gray-900">Rebounds Leaders</h3>
        <div className="mt-2">
          {sortedByRebounds.map((player, index) => (
            <div key={player.id} className="flex justify-between py-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{player.name}</span>
              </div>
              <span className="text-sm text-gray-500">{player.stats?.reb.toFixed(1)} RPG</span>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-sm font-medium text-gray-900">Assists Leaders</h3>
        <div className="mt-2">
          {sortedByAssists.map((player, index) => (
            <div key={player.id} className="flex justify-between py-1">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 w-6">{index + 1}.</span>
                <span className="text-sm font-medium text-gray-900 ml-2">{player.name}</span>
              </div>
              <span className="text-sm text-gray-500">{player.stats?.ast.toFixed(1)} APG</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 