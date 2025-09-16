import React, { useEffect, useContext } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { CurrentUserContext } from './context/CurrentUserContext'
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import Navigation from "./routes/Navigation";
import { fetchUsers } from './features/UsersSlice';

function App() {
  const dispatch = useDispatch();
  const { handleUser } = useContext(CurrentUserContext)

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      handleUser(currentUser);
    });
    return () => unsubscribe();
  }, [handleUser]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Navigation />
    </div>
  );
}

export default App;
