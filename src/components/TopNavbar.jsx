// components/TopNavbar.js

import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';

const TopNavbar = () => {
    const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-indigo-600">System Admin Dashboard</h1>
      <Link href={"/profile"} className="flex items-center space-x-4">
        <span className="text-gray-700">Profile</span>
        <img
          src={currentUser.profilePicture}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
      </Link>
    </header>
  );
};

export default TopNavbar;
