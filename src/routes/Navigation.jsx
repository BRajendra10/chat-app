import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";

import Signin from '../screens/Signin';
import Signup from '../screens/Signup';
import Home from '../screens/Home';
import Sidebar from '../components/Sidebar';
import ChatsContainer from '../components/ChatsContainer';

function Navigation() {
    const currentUser = useSelector((state) => state.users.currentUser);
    const selectedUser = useSelector((state) => state.users.selectedUser);

    return (
        <Routes>
            <Route path="/" element={<Home />} >
                <Route index element={<Sidebar />} />
                <Route path="/chats" element={!selectedUser.uid ?
                    (<Navigate to="/" replace />)
                    : (<ChatsContainer currentUser={currentUser} selectedUser={selectedUser} />)} />
            </Route>
            <Route path="/login" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<>Page not found</>} />
        </Routes>
    )
}

export default Navigation