import React, { useEffect } from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./routes/Navigation";
import { fetchUsers } from './features/UsersSlice';
import { setCurrentUser } from './features/UsersSlice';

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

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
