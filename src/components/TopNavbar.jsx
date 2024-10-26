"use client";

import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const TopNavbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-indigo-600">
        System Admin Dashboard
      </h1>
      <Link href={"/profile"} className="flex items-center space-x-4">
        <span className="text-gray-700">Profile</span>
        {isAdmin && (
          <img
            src={currentUser.profilePicture}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        )}
        {isStaff && (
          <img
            src={currentUser.profilePictureStaff}
            alt="profile"
            className="w-8 h-8 rounded-full"
          />
        )}
      </Link>
    </header>
  );
};

export default TopNavbar;
