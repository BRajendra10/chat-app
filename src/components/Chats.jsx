import React, { useMemo, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createChat, deleteMessage, sendMessage, updateMessage } from "../features/chatsSlice";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoPaperPlane, IoArrowBackSharp } from "react-icons/io5";

function Chats({ currentUser, selectedUser, chatData }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [msg, setMsg] = useState({});
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [messages, setMessages] = useState([...[], chatData?.messages]);

  const handleClick = () => {
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

  const deleteMsg = (msg) => {
    dispatch(deleteMessage({
      chatId: chatData.id,
      messageId: msg.id
    }));
  }

  const handleMsg = (msg) => {
    if (!isUpdating) {
      setText(msg.message);
      setMsg(msg);
      setIsUpdating(true);
    } else {
      dispatch(updateMessage({
        chatId: chatData.id,
        messageId: msg.id,
        newText: text
      }));
      setText("");
      setIsUpdating(false);
    }
  }

  const sortedMessages = useMemo(() => {
    return [...(messages || [])].sort((a, b) => {
      const aTime = a.createdAt?.toMillis?.() ?? new Date(a.createdAt).getTime();
      const bTime = b.createdAt?.toMillis?.() ?? new Date(b.createdAt).getTime();
      return aTime - bTime;
    });
  }, [messages]);

  useEffect(() => {
    if (!chatData?.id) return

    const q = query(collection(db, "chats", chatData.id, "message"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe(); // cleanup listener
  }, [chatData?.id]);

  return (
    <div className="flex-1 flex flex-col border rounded-lg bg-zinc-100">
      {/* Chat Header */}
      <div className="w-full h-[4.5rem] flex items-center gap-3 px-5 border rounded-t-lg border-gray-200 bg-white shadow-sm">
        <button className="block md:hidden" onClick={() => navigate("/")}>
          <IoArrowBackSharp className="text-lg" />
        </button>
        <img src={selectedUser?.photoURL} alt="avatar" className="w-10 h-10 rounded-full object-cover bg-gray-200" />
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-700">
            {selectedUser?.displayName}
          </span>
          {chatData?.lastMessage && (
            <span className="text-xs text-gray-400">
              Last msg: {chatData.lastMessage.message}
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="w-full flex-1 overflow-y-auto p-6 space-y-5 custom-scroll">
        {sortedMessages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">No messages yet…</p>
        ) : (
          sortedMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.senderId === currentUser.uid ? "items-end" : "items-start"}`}
            >
              <div className="group relative">
                <span></span>
                <span className={`px-4 py-2 rounded-2xl shadow max-w-xs ${msg.senderId === currentUser.uid
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-800"
                  }`}>{msg.message}</span>
                {msg.senderId === currentUser.uid && <div className="hidden absolute translate-y-1/2 top-1/2 max-w-xs group-hover:flex justify-start items-center">
                  <button className="p-2 text-lg" onClick={() => handleMsg(msg)}><RiPencilFill /></button>
                  <button className="p-2 text-lg" onClick={() => deleteMsg(msg)}><MdDelete /></button>
                </div>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="w-full h-[4.5rem] px-5 flex items-center rounded-b-lg border-gray-200 bg-white">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg outline-none placeholder-gray-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
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
