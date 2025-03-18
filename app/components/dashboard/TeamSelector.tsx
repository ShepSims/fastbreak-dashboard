'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Team } from '@/types/player';

interface TeamSelectorProps {
  teams: Team[];
  selectedTeamId: number;
}

export default function TeamSelector({ teams, selectedTeamId }: TeamSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTeamChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const teamId = event.target.value;
    router.push(`${pathname}?team=${teamId}`);
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="team-select" className="text-sm font-medium text-gray-700">
        Select Team:
      </label>
      <select
        id="team-select"
        value={selectedTeamId}
        onChange={handleTeamChange}
        className="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.full_name}
          </option>
        ))}
      </select>
    </div>
  );
} 