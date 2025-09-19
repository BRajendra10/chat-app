import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Chats from "./Chats";

export default function ChatContainer({ currentUser, selectedUser }) {
  const { chats } = useSelector((state) => state.chats);

  // ✅ Find the chat between these two users (if it exists)
  const chatData = useMemo(() => {
    return chats.find(
      (chat) =>
        chat.members.includes(currentUser.uid) &&
        chat.members.includes(selectedUser.uid)
    );
  }, [chats, currentUser.uid, selectedUser.uid]);

  // ✅ Decide what to render:
  if (!selectedUser?.uid) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center border rounded-lg bg-zinc-100">
        <span>Select chat to start chatting</span>
      </div>
    );
  }

  return (
    <Chats
      currentUser={currentUser}
      selectedUser={selectedUser}
      chatData={chatData} // ✅ Pass chat object only if it exists
    />
  );
}
