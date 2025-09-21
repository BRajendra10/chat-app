import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

import { FaPen } from "react-icons/fa";

function UserCard({ click }) {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.users);
  const { isClicked, setIsClicked } = click;

  const [avatarURL, setAvatarURL] = useState(currentUser.photoURL || "");
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("✅ Logged out");
      navigate("/login");
    } catch (error) {
      console.error("❌ Logout error:", error.message);
    }
  };

  const handleAvatarUpdate = async () => {
    if (!newAvatar) return;

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, { photoURL: newAvatar });

      // Update Firestore document
      await updateDoc(doc(db, "users", currentUser.uid), { photoURL: newAvatar });

      // Update local state
      setAvatarURL(newAvatar);
      setNewAvatar("");
      setIsEditing(false);
      console.log("✅ Avatar updated");
    } catch (error) {
      console.error("❌ Avatar update error:", error.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => setIsClicked(!isClicked)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[22rem] p-6 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute top-3 right-3 hover:text-gray-600"
          onClick={() => setIsClicked(!isClicked)}
        >
          ✖
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-sky-400">
            <img
              src={avatarURL}
              alt="user avatar"
              className="w-full h-full rounded-full object-cover"
            />
            {/* Pen icon */}
            <FaPen
              className="absolute translate-x-1/3 top-3 right-0 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
              size={22}
              onClick={() => setIsEditing(!isEditing)}
            />
          </div>

          <h2 className="mt-4 text-xl font-bold text-gray-800">
            {currentUser.displayName || "No Name"}
          </h2>
          <p className="text-gray-500 text-sm">{currentUser.email}</p>

          <div className="w-full h-px bg-gray-200 my-4"></div>

          {/* Avatar edit input */}
          {isEditing && (
            <div className="flex flex-col gap-2 w-full mb-3">
              <input
                type="text"
                placeholder="Paste avatar URL here"
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAvatarUpdate}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Update Avatar
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(UserCard);
