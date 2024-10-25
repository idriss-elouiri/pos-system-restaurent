// components/TopNavbar.js

import React from 'react';

const TopNavbar = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-indigo-600">System Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700">Profile</span>
        <img
          src="https://via.placeholder.com/30"
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default TopNavbar;
