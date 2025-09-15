import React from "react";

function Chat({ user }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white hover:bg-gray-100 rounded-xl shadow-lg cursor-pointer transition">
      {/* User Avatar */}
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* User Info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
        <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
      </div>
    </div>
  );
}

export default Chat;
