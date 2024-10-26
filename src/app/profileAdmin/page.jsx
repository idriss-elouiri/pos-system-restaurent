"use client";

import Layout from "@/components/Layout";
import ProfileComp from "@/components/profile/ProfileComp";
import ProfileStaff from "@/components/profileStaff/ProfileComp";
import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

  return (
    <Layout>
      {isAdmin && <ProfileComp />}
      {isStaff && !isAdmin && <ProfileStaff />} {/* Only renders ProfileStaff if user is staff but not admin */}
    </Layout>
  );
};

export default Profile;
