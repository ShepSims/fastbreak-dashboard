'use client';

import { useState } from 'react';
import { PlayerWithStats } from '@/types/player';

interface PlayerLeaderboardProps {
  players: PlayerWithStats[];
}

export default function PlayerLeaderboard({ players }: PlayerLeaderboardProps) {
  const [selectedStat, setSelectedStat] = useState<string>('pts');

  // Stats categories and their display names
  const statCategories = [
    { value: 'pts', label: 'Points' },
    { value: 'reb', label: 'Rebounds' },
    { value: 'ast', label: 'Assists' },
    { value: 'fg_pct', label: 'Field Goal %' },
    { value: 'min', label: 'Minutes' }
  ];

  // Filter out players with no stats data and sort by the selected stat
  const playersWithStats = players
    .filter(player => player.stats)
    .sort((a, b) => {
      // Special case for minutes which is a string like "32:45"
      if (selectedStat === 'min') {
        const aMinutes = a.stats?.min ? parseInt(a.stats.min.split(':')[0]) : 0;
        const bMinutes = b.stats?.min ? parseInt(b.stats.min.split(':')[0]) : 0;
        return bMinutes - aMinutes;
      }
      
      return ((b.stats?.[selectedStat as keyof typeof b.stats] as number) || 0) - 
             ((a.stats?.[selectedStat as keyof typeof a.stats] as number) || 0);
    })
    .slice(0, 5); // Get top 5 players

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="stat-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Statistic:
        </label>
        <select
          id="stat-select"
          value={selectedStat}
          onChange={(e) => setSelectedStat(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {statCategories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {statCategories.find(cat => cat.value === selectedStat)?.label}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {playersWithStats.length > 0 ? (
            playersWithStats.map((player, index) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player.position}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {selectedStat === 'fg_pct' && player.stats ? (
                    `${(player.stats[selectedStat as keyof typeof player.stats] as number * 100).toFixed(1)}%`
                  ) : selectedStat === 'min' && player.stats ? (
                    player.stats[selectedStat as keyof typeof player.stats]
                  ) : player.stats ? (
                    (player.stats[selectedStat as keyof typeof player.stats] as number).toFixed(1)
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 