import React, { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createChat, deleteMessage, sendMessage, updateMessage } from "../features/chatsSlice";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoPaperPlane, IoArrowBackSharp } from "react-icons/io5";
import Message from "./Message";

function Chats({ currentUser, selectedUser, chatData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState({});
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleClick = () => {
    if (!text.trim()) return; // avoid sending empty messages

    if (chatData) {
      if (isUpdating) {
        dispatch(updateMessage({
          chatId: chatData.id,
          messageId: msg.id,
          newText: text
        }));
        setIsUpdating(false);
      } else {
        dispatch(sendMessage({ chatId: chatData.id, senderId: currentUser.uid, message: text }));
      }
    } else {
      dispatch(createChat({
        type: "direct",
        members: [currentUser.uid, selectedUser.uid],
      }))
        .unwrap()
        .then((newChat) => {
          dispatch(
            sendMessage({
              chatId: newChat.id,
              senderId: currentUser.uid,
              message: text,
            })
          );
        });
    }

    setText("");
  };

  // const deleteMsg = (msg) => {
  //   dispatch(deleteMessage({
  //     chatId: chatData.id,
  //     messageId: msg.id
  //   }));
  // }

  // const handleMsg = (msg) => {
  //   if (!isUpdating) {
  //     setText(msg.message);
  //     setMsg(msg);
  //     setIsUpdating(true);
  //   } else {
  //     dispatch(updateMessage({
  //       chatId: chatData.id,
  //       messageId: msg.id,
  //       newText: text
  //     }));
  //     setText("");
  //     setIsUpdating(false);
  //   }
  // }

  const sortedMessages = useMemo(() => {
    return [...(messages || [])].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime();
      return aTime - bTime;
    });
  }, [messages]);

  useEffect(() => {
    // Reset state when switching users/chats
    setMessages(chatData?.messages || []);
    setText("");
    setIsUpdating(false);
    setMsg({});

    if (!chatData?.id) return; // no chat exists yet

    const q = query(collection(db, "chats", chatData.id, "message"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // cleanup listener
  }, [chatData]);

  return (
    <div className="flex-1 flex flex-col border rounded-lg bg-zinc-100">
      {/* Chat Header */}
      <div className="w-full h-[4.5rem] flex items-center gap-3 px-5 border rounded-t-lg border-gray-200 bg-white shadow-sm">
        <button className="block md:hidden text-xl" onClick={() => navigate("/")}>
          <IoArrowBackSharp />
        </button>

        <img src={selectedUser?.photoURL} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200" />

        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-700">
            {selectedUser?.displayName}
          </span>
          {chatData?.lastMessage && (
            <span className="w-60 text-xs text-gray-400 truncate">
              Last msg: {chatData.lastMessage.message}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="w-full flex-1 overflow-y-auto p-5 flex flex-col space-y-3 custom-scroll">
        {sortedMessages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No messages yet…</p>
        ) : (
          sortedMessages.map((msg) => (
            <Message
              key={msg.id}
              msg={msg}
              currentUser={currentUser}
              onEdit={(id, oldText) => {
                const newText = prompt("Edit your message:", oldText);
                if (newText && newText.trim()) {
                  dispatch(updateMessage({ chatId: chatData.id, messageId: id, newText }));
                }
              }}
              onDelete={(id) => {
                if (window.confirm("Delete this message?")) {
                  dispatch(deleteMessage({ chatId: chatData.id, messageId: id }));
                }
              }}
            />
          ))
        )}
      </div>


      {/* Input */}
      <div className="sticky bottom-0 rounded-b-lg w-full bg-white px-5 py-4 flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg outline-none placeholder-gray-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => window.scrollTo(0, document.body.scrollHeight)} // helps scroll into view on mobile
        />
        <button
          className="ml-3 bg-orange-500 hover:bg-orange-600 p-3 md:px-5 md:py-2 rounded-full text-sm text-white"
          onClick={handleClick}
        >
          <span className="hidden md:block">Send message</span>
          <IoPaperPlane className="block md:hidden text-lg" />
        </button>
      </div>

    </div>
  );
}

export default React.memo(Chats);
