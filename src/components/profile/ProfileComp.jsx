"use client";

import Layout from "@/components/Layout";
import React from "react";
import { useSelector } from "react-redux";
import ProfileAdmin from "../profileAdmin/ProfileAdmin";
import ProfileStaff from "../profileStaff/ProfileStaff";

const ProfileComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;

  return (
    <Layout>
      {isAdmin && <ProfileAdmin />}
      {isStaff && !isAdmin && <ProfileStaff />} {/* Only renders ProfileStaff if user is staff but not admin */}
    </Layout>
  );
};

export default ProfileComp;
