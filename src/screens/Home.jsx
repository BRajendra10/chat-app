import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import { IoMdNotificationsOutline } from "react-icons/io";

import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats";
import Profile from "../components/Profile";
import ChatContainer from "../components/ChatsContainer";

function Home() {
    const [isClicked, setIsClicked] = useState(false);
    const currentUser = useSelector((state) => state.users.currentUser);
    const selectedUser = useSelector((state) => state.users.selectedUser);

    if (!currentUser) return null;

    return (
        <div className="w-full h-screen bg-white flex flex-col gap-2 p-2">
            {isClicked && <Profile click={{ isClicked, setIsClicked }} />}
            {/* 🔹 Top Bar */}
            <div className="w-full h-[4rem] border rounded-lg flex items-center justify-between px-6 shadow">
                <h1 className="text-xl">Chats</h1>

                {/* Notifications + Logout */}  
                <div className="flex items-center gap-4">
                    <button className="relative">
                        <IoMdNotificationsOutline className="text-2xl" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-sky-400 rounded-full"></span>
                    </button>
                    {/* Current User */}
                    <div className="flex items-center gap-3">
                        <img
                            src={currentUser?.photoURL}
                            alt="avatar"
                            className="w-13 h-13 rounded-full border p-1 border-orange-300"
                            onClick={() => setIsClicked(true)}
                        />
                    </div>
                </div>
            </div>

            {/* 🔹 Main Content */}
            <div className="hidden md:flex flex-1 gap-2 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Chat Area */}
                {!selectedUser.uid ?
                    <div className="flex-1 flex flex-col justify-center items-center border rounded-lg bg-zinc-100">
                        <span>Select chat to start chatting</span>
                    </div>
                    : <ChatContainer currentUser={currentUser} selectedUser={selectedUser} />}
            </div>

            <div className="flex md:hidden flex-1 gap-2 overflow-hidden">
                {/* Sidebar */}
                <Outlet />
            </div>
        </div>
    );
}

export default React.memo(Home);
