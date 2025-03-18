'use client';

import { useState } from 'react';
import { PlayerWithStats } from '@/types/player';

interface PerformanceRadarChartProps {
  players: PlayerWithStats[];
}

export default function PerformanceRadarChart({ players }: PerformanceRadarChartProps) {
  // Filter players with stats
  const playersWithStats = players.filter(player => player.stats);
  
  // State for selected players (up to 3)
  const [selectedPlayers, setSelectedPlayers] = useState<PlayerWithStats[]>([]);

  // Handle player selection/deselection
  const togglePlayer = (player: PlayerWithStats) => {
    if (selectedPlayers.find(p => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
    } else if (selectedPlayers.length < 3) {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Select Players (max 3)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {playersWithStats.slice(0, 9).map(player => (
            <button
              key={player.id}
              onClick={() => togglePlayer(player)}
              className={`text-xs py-1 px-2 rounded-full ${
                selectedPlayers.find(p => p.id === player.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>

      {selectedPlayers.length > 0 ? (
        <div>
          <div className="flex justify-center items-center h-64">
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">
                This is a placeholder for the radar chart. In a real implementation, 
                we would use a library like Chart.js or Recharts to render a proper radar chart 
                comparing the selected players across multiple statistical categories.
              </p>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900">Selected Players:</h4>
                <ul className="mt-2 space-y-1">
                  {selectedPlayers.map(player => (
                    <li key={player.id} className="text-sm">
                      {player.name}: {player.stats?.pts.toFixed(1)} PPG, {player.stats?.reb.toFixed(1)} RPG, {player.stats?.ast.toFixed(1)} APG
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-sm text-gray-500">Select players to compare their stats</p>
        </div>
      )}
    </div>
  );
} 