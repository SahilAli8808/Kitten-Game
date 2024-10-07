// src/components/RightPanel/RightPanel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import SearchBar from './SearchBar';
import LeaderboardTable from './LeaderboardTable';
import { fetchLeaderboard, updateLeaderboard } from '../../redux/leaderboardSlice';

const socket = io('http://localhost:5000');

const RightPanel = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: leaderboardData, status, error } = useSelector(state => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());

    socket.on('leaderboardUpdate', (newLeaderboard) => {
      dispatch(updateLeaderboard(newLeaderboard));
    });

    return () => {
      socket.off('leaderboardUpdate');
    };
  }, [dispatch]);

  const filteredData = leaderboardData.filter((entry) =>
    entry.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return <div>Loading leaderboard...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading leaderboard: {error}</div>;
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-2xl font-semibold">Leaderboard</h2>
      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <LeaderboardTable data={filteredData} />
    </div>
  );
};

export default RightPanel;