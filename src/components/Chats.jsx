import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "../features/chatsSlice";

function Chats({ currentUser, selectedUser }) {
  const dispatch = useDispatch();
  const [msg, setMsg] = useState("");
  const { chats } = useSelector((state) => state.chats);

  // ✅ Only calculate chat once (memoized)
  const chatData = useMemo(() => {
    return chats.find(
      (chat) =>
        chat.members.includes(currentUser.uid) &&
        chat.members.includes(selectedUser.uid)
    );
  }, [chats, currentUser.uid, selectedUser.uid]);


  const handleClick = () => {
    dispatch(sendMessage({ chatId: chatData.id, senderId: currentUser.uid, message: msg }))
  }

  // Until you really fetch messages from Firestore:
  const messages = chatData?.messages || [];

  const sortedMessages = useMemo(() => {
    return [...(chatData?.messages || [])].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime();
      return aTime - bTime;
    });
  }, [chatData?.messages]);

  return (
    <div className="flex-1 flex flex-col border rounded-lg bg-zinc-100">
      {/* 🔹 Chat Header */}
      <div className="w-full h-[4.5rem] flex items-center gap-3 px-5 border rounded-t-lg border-gray-200 bg-white shadow-sm">
        <img
          src={selectedUser?.photoURL}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
        />
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-700">
            {selectedUser?.displayName || "Select a chat to start messaging"}
          </span>
          {chatData?.lastMessage && (
            <span className="text-xs text-gray-400">
              Last message: {chatData.lastMessage.text}
            </span>
          )}
        </div>
      </div>

      {/* 🔹 Messages */}
      <div className="w-full flex-1 overflow-y-auto p-6 space-y-4">
        {sortedMessages.length === 0 && (
          <p className="text-gray-400 text-sm text-center">
            No messages yet…
          </p>
        )}
        {sortedMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === currentUser.uid
              ? "justify-end"
              : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow max-w-xs ${msg.senderId === currentUser.uid
                ? "bg-orange-500 text-white"
                : "bg-gray-200 text-gray-800"
                }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Input */}
      <div className="w-full h-[4.5rem] px-5 flex items-center rounded-b-lg border-gray-200 bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg outline-none placeholder-gray-400"
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="ml-3 bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full text-sm text-white" onClick={() => handleClick()}>
          Send message
        </button>
      </div>
    </div>
  );
}

export default React.memo(Chats);
