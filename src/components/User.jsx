import React from "react";
import { useDispatch } from "react-redux";
import { selectUser } from '../features/usersSlice';
import { useNavigate } from "react-router-dom";

function User({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { displayName, email, photoURL } = user;

  const HandleClick = (user) => {
    dispatch(selectUser(user));
    navigate("/chats");
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white hover:bg-gray-100 rounded-xl shadow-lg cursor-pointer transition" onClick={() => HandleClick(user)}>
      {/* User Avatar */}
      <img
        src={photoURL}
        alt={displayName}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* User Info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
        <p className="text-sm text-zinc-500 truncate">{email}</p>
      </div>
    </div>
  );
}

export default User;
