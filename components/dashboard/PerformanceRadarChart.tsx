'use client';

import { useState } from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { PlayerWithStats } from '@/types/player';

// Register ChartJS components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PerformanceRadarChartProps {
  players: PlayerWithStats[];
}

export default function PerformanceRadarChart({ players }: PerformanceRadarChartProps) {
  // State to track selected players (allow up to 3 for comparison)
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  // Filter out players with no stats
  const playersWithStats = players.filter(player => player.stats);

  // Handler for player selection
  const handlePlayerSelection = (playerId: number) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) {
        // Remove player if already selected
        return prev.filter(id => id !== playerId);
      } else if (prev.length < 3) {
        // Add player if less than 3 selected
        return [...prev, playerId];
      }
      return prev;
    });
  };

  // Define the stat categories to display
  const statCategories = ['pts', 'reb', 'ast', 'stl', 'blk', 'fg_pct'];
  const statLabels = ['Points', 'Rebounds', 'Assists', 'Steals', 'Blocks', 'FG%'];
  
  // Max values for normalization (used to scale stats)
  const maxValues = {
    pts: 30,     // Max expected points
    reb: 15,     // Max expected rebounds
    ast: 10,     // Max expected assists
    stl: 3,      // Max expected steals
    blk: 3,      // Max expected blocks
    fg_pct: 0.6  // Max expected field goal percentage (60%)
  };

  // Get normalized value for radar chart (0-100 scale)
  const getNormalizedValue = (stat: string, value: number): number => {
    if (stat === 'fg_pct') {
      // Convert FG% to a 0-100 scale
      return (value / maxValues[stat as keyof typeof maxValues]) * 100;
    }
    return (value / maxValues[stat as keyof typeof maxValues]) * 100;
  };

  // Generate radar chart data for selected players
  const selectedPlayers = playersWithStats.filter(player => 
    selectedPlayerIds.includes(player.id)
  );

  const radarData = {
    labels: statLabels,
    datasets: selectedPlayers.map((player, index) => {
      // Define different colors for each player
      const colors = [
        { bg: 'rgba(59, 130, 246, 0.2)', border: 'rgb(59, 130, 246)' },
        { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)' },
        { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' }
      ];
      
      return {
        label: player.name,
        data: statCategories.map(stat => 
          getNormalizedValue(stat, player.stats ? 
            (player.stats[stat as keyof typeof player.stats] as number) || 0 : 0)
        ),
        backgroundColor: colors[index].bg,
        borderColor: colors[index].border,
        borderWidth: 2,
      };
    }),
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const statIndex = context.dataIndex;
            const statName = statLabels[statIndex];
            const playerIndex = context.datasetIndex;
            const player = selectedPlayers[playerIndex];
            const originalValue = player.stats ? 
              player.stats[statCategories[statIndex] as keyof typeof player.stats] : 0;
            
            if (statName === 'FG%') {
              return `${label}: ${((originalValue as number) * 100).toFixed(1)}%`;
            }
            return `${label}: ${(originalValue as number).toFixed(1)}`;
          }
        }
      }
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Players to Compare (max 3):
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {playersWithStats.slice(0, 12).map(player => (
            <button
              key={player.id}
              onClick={() => handlePlayerSelection(player.id)}
              className={`px-3 py-2 text-xs rounded-md ${
                selectedPlayerIds.includes(player.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>

      {selectedPlayers.length > 0 ? (
        <div className="h-80">
          <Radar data={radarData} options={radarOptions} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-md">
          <p className="text-gray-500">Select players to view performance comparison</p>
        </div>
      )}
    </div>
  );
} 