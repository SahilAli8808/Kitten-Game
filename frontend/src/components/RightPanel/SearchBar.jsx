// src/components/RightPanel/SearchBar.jsx
import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-4 w-full">
      <div className="block w-full">
        <input
          type="text"
          placeholder="Search by username"
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SearchBar;
