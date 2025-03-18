'use client';

import { PlayerWithStats } from '@/types/player';

interface PointsDistributionProps {
  players: PlayerWithStats[];
}

export default function PointsDistribution({ players }: PointsDistributionProps) {
  // Filter players with stats
  const playersWithStats = players.filter(player => player.stats);
  
  // Sort by points per game in descending order
  const sortedPlayers = [...playersWithStats].sort((a, b) => (b.stats?.pts || 0) - (a.stats?.pts || 0));

  // Calculate the maximum points for scaling
  const maxPoints = Math.max(...playersWithStats.map(player => player.stats?.pts || 0));

  return (
    <div className="space-y-4">
      {sortedPlayers.map(player => (
        <div key={player.id} className="flex items-center">
          <div className="w-20 flex-shrink-0">
            <span className="text-sm font-medium text-gray-900">{player.name}</span>
          </div>
          <div className="flex-grow mx-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((player.stats?.pts || 0) / maxPoints) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="w-10 flex-shrink-0 text-right">
            <span className="text-sm text-gray-500">{player.stats?.pts.toFixed(1)}</span>
          </div>
        </div>
      ))}
    </div>
  );
} 