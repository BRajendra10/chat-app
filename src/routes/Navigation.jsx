import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Signin from '../screens/Signin';
import Signup from '../screens/Signup';
import Home from '../screens/Home';

function Navigation() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default Navigation