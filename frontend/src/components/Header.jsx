// src/components/Header/Header.jsx
import React from 'react';
import { FaGamepad } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg h-14 flex items-center justify-between px-6 fixed w-full">
      {/* Logo and Game Title */}
      <div className="flex items-center">
        <FaGamepad className="text-2xl mr-2 text-yellow-400" /> {/* Game Icon */}
        <h1 className="text-lg font-bold tracking-wide">Exploding Kitten Game</h1> {/* Game Title */}
      </div>

      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        {/* Rules Link Button */}
        <a 
          href="https://sunset-parrot-38b.notion.site/Exploding-Kitten-e7f63daf13c244588003366474a1ef7b" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white text-purple-600 text-sm px-3 py-1 rounded-md shadow-md hover:bg-gray-200 transition"
        >
          View Rules
        </a>
      </div>
    </header>
  );
};

export default Header;
