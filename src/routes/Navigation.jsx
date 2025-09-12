import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import UserCard from '../components/User';

function Navigation() {
  return (
    <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user" element={<UserCard />} />
    </Routes>
  )
}

export default Navigation