import { Table } from '@radix-ui/themes';
import React from 'react';

const LeaderboardTable = ({ data }) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Rank</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.length === 0 ? (
          <Table.Row>
            <Table.Cell colSpan={3} className="text-center">
              No data available
            </Table.Cell>
          </Table.Row>
        ) : (
          data.map((entry) => (
            <Table.Row key={entry.username} className="hover:bg-gray-700 transition-colors">
              <Table.RowHeaderCell>{entry.rank}</Table.RowHeaderCell>
              <Table.Cell>{entry.username}</Table.Cell>
              <Table.Cell>{entry.score}</Table.Cell>
            </Table.Row>
          ))
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default LeaderboardTable;
