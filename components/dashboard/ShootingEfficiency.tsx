'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PlayerWithStats } from '@/types/player';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ShootingEfficiencyProps {
  players: PlayerWithStats[];
}

export default function ShootingEfficiency({ players }: ShootingEfficiencyProps) {
  // Filter out players with no stats or shooting stats
  const playersWithStats = players
    .filter(player => player.stats && (player.stats.fg_pct || player.stats.fg3_pct))
    // Sort by FG%
    .sort((a, b) => (b.stats?.fg_pct || 0) - (a.stats?.fg_pct || 0))
    .slice(0, 8); // Top 8 shooters

  const chartData = {
    labels: playersWithStats.map(player => player.name.split(' ')[1]), // Use last name for brevity
    datasets: [
      {
        label: 'Field Goal %',
        data: playersWithStats.map(player => (player.stats?.fg_pct || 0) * 100), // Convert to percentage
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: '3-Point %',
        data: playersWithStats.map(player => (player.stats?.fg3_pct || 0) * 100), // Convert to percentage
        backgroundColor: 'rgba(16, 185, 129, 0.6)', // Green
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
  };

  if (playersWithStats.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No shooting data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
} 