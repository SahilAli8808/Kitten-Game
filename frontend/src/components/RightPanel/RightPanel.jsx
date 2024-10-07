// src/components/RightPanel/RightPanel.jsx
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import LeaderboardTable from './LeaderboardTable';

const mockData = [
  { rank: 1, username: 'Alice', score: 1500 },
  { rank: 2, username: 'Bob', score: 1200 },
  { rank: 3, username: 'Charlie', score: 1100 },
  { rank: 4, username: 'David', score: 900 },
  { rank: 5, username: 'Eve', score: 800 },
  // Add more mock data as needed
];

const RightPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = mockData.filter((entry) =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-2xl font-semibold">Leaderboard</h2>
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <LeaderboardTable data={filteredData} />
    </div>
  );
};

export default RightPanel;
