import React, { useState } from "react";
import { RiMore2Fill, RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";

function Message({ msg, currentUser, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  //TODO: Update this updating and deleting method (ui, ux)

  return (
    <div
      className={`relative flex flex-col ${
        msg.senderId === currentUser.uid ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`max-w-[25rem] px-4 py-2 rounded-2xl shadow text-sm break-words relative ${
          msg.senderId === currentUser.uid
            ? "bg-orange-500 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        {msg.message}
        {msg.edited && <span className="text-xs opacity-70 ml-2">(edited)</span>}

        {/* Options button */}
        {msg.senderId === currentUser.uid && (
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="absolute top-1/2 -translate-y-1/2 right-1 text-lg text-white/80 hover:text-white"
          >
            <RiMore2Fill />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {showMenu && (
        <div className="absolute top-full mt-1 bg-white rounded-md shadow-md border text-sm right-0 w-24 z-10">
          <button
            onClick={() => {
              setShowMenu(false);
              onEdit(msg.id, msg.message);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-gray-700"
          >
            <RiPencilFill /> Edit
          </button>
          <button
            onClick={() => {
              setShowMenu(false);
              onDelete(msg.id);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-red-600"
          >
            <MdDelete /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default Message;
