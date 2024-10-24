"use client"

import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

const Header = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user);
  return (
    <div>{currentUser.email}</div>
  )
}

export default Header