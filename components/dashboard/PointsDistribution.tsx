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

interface PointsDistributionProps {
  players: PlayerWithStats[];
}

export default function PointsDistribution({ players }: PointsDistributionProps) {
  // Filter out players with no stats data and sort by points
  const playersWithStats = players
    .filter(player => player.stats && player.stats.pts !== undefined)
    .sort((a, b) => (b.stats?.pts || 0) - (a.stats?.pts || 0));

  const chartData = {
    labels: playersWithStats.map(player => player.name.split(' ')[1]), // Use last name for brevity
    datasets: [
      {
        label: 'Points Per Game',
        data: playersWithStats.map(player => player.stats?.pts || 0),
        backgroundColor: playersWithStats.map(player => {
          // Color code by position
          switch (player.position) {
            case 'G': return 'rgba(59, 130, 246, 0.6)'; // Blue for Guards
            case 'F': return 'rgba(16, 185, 129, 0.6)'; // Green for Forwards
            case 'C': return 'rgba(245, 158, 11, 0.6)'; // Orange for Centers
            default: return 'rgba(107, 114, 128, 0.6)'; // Gray for others
          }
        }),
        borderColor: playersWithStats.map(player => {
          switch (player.position) {
            case 'G': return 'rgb(59, 130, 246)';
            case 'F': return 'rgb(16, 185, 129)';
            case 'C': return 'rgb(245, 158, 11)';
            default: return 'rgb(107, 114, 128)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems: any) {
            const index = tooltipItems[0].dataIndex;
            return playersWithStats[index].name;
          },
          label: function(context: any) {
            return `Points: ${context.raw.toFixed(1)}`;
          },
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const player = playersWithStats[index];
            return `Position: ${player.position}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Points Per Game'
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
        <p className="text-gray-500">No points data available</p>
      </div>
    );
  }

  return (
    <div className="h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
} 