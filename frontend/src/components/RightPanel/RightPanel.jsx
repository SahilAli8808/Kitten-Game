// src/components/RightPanel/RightPanel.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import SearchBar from './SearchBar';
import LeaderboardTable from './LeaderboardTable';
import { fetchLeaderboard, updateLeaderboard } from '../../redux/leaderboardSlice';
import { Callout } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

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
    return <div>
      <h1 className="mb-4 text-2xl font-semibold">Leaderboard</h1>
      <h4 className="mb-4 text-xl">Loading leaderboard...</h4>
      </div>;
  }

  if (status === 'failed') {
    return <div>
      <h1 className="mb-4 text-4xl font-semibold">Leaderboard</h1>
      <h4 className="mb-4 text-2xl text-red-500">😢 OOps! Looks like you have't Start your Server</h4>
      
      <Callout.Root>
	<Callout.Icon>
		<InfoCircledIcon />
	</Callout.Icon>
	<Callout.Text>
  Make Sure you have start your Server and Redis Server {error}
	</Callout.Text>
</Callout.Root>
      </div>;
  }

  return (
    <div className="flex flex-col">
      <h2 className="mb-4 text-4xl font-semibold">Leaderboard</h2>
      <h2 className="mb-4 text-xl font-semibold">Real-time updating leaderboard</h2>

      <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <LeaderboardTable data={filteredData} />
    </div>
  );
};

export default RightPanel;