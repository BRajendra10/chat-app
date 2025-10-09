import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { fetchUsers } from './features/usersSlice';
import { fetchUserChats } from './features/chatsSlice';
import { setCurrentUser } from './features/usersSlice';

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Navigation from "./routes/Navigation";
import './App.css'

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchUserChats(currentUser?.uid));
  }, [dispatch, currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      dispatch(setCurrentUser(currentUser))
    });
    return () => unsubscribe();
  }, [dispatch, currentUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Navigation />
    </div>
  );
}

export default App;
