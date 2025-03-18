'use client';

import { PlayerWithStats } from '@/types/player';

interface ShootingEfficiencyProps {
  players: PlayerWithStats[];
}

export default function ShootingEfficiency({ players }: ShootingEfficiencyProps) {
  // Filter players with stats and minimum minutes played
  const filteredPlayers = players
    .filter(player => player.stats && player.stats.min.split(':')[0] >= '15');

  // Sort by field goal percentage
  const sortedByFGPct = [...filteredPlayers]
    .sort((a, b) => (b.stats?.fg_pct || 0) - (a.stats?.fg_pct || 0))
    .slice(0, 5);

  // Sort by three-point percentage
  const sortedBy3PPct = [...filteredPlayers]
    .sort((a, b) => (b.stats?.fg3_pct || 0) - (a.stats?.fg3_pct || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Field Goal Percentage</h3>
        <div className="space-y-2">
          {sortedByFGPct.map(player => (
            <div key={player.id} className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{player.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {((player.stats?.fg_pct || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(player.stats?.fg_pct || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">3-Point Percentage</h3>
        <div className="space-y-2">
          {sortedBy3PPct.map(player => (
            <div key={player.id} className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{player.name}</span>
                <span className="text-sm font-medium text-gray-900">
                  {((player.stats?.fg3_pct || 0) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${(player.stats?.fg3_pct || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 