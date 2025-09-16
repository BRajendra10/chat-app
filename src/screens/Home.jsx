import React, { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { IoMdNotificationsOutline } from "react-icons/io";
import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats";
import UserCard from "../components/User";

function Home() {
    const navigate = useNavigate();
    const [isClicked, setIsClicked] = useState(false);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) navigate("/login");
            else setUsers(currentUser);
        });
        return () => unsubscribe();
    }, [navigate]);

    if (!users) return null;

    return (
        <div className="w-full h-screen bg-white flex flex-col gap-2 p-2">
            {isClicked && <UserCard click={{ isClicked, setIsClicked }} />}
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
                            src={
                                users.photoURL ||
                                `https://ui-avatars.com/api/?name=${users.displayName || "User"}&size=50&background=f97316&color=fff`
                            }
                            alt="avatar"
                            className="w-13 h-13 rounded-full border p-1 border-orange-300"
                            onClick={() => setIsClicked(true)}
                        />
                    </div>
                </div>
            </div>

            {/* 🔹 Main Content */}
            <div className="flex flex-1 gap-2 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Chat Area */}
                 <Chats />
                {/* {!false ? <div className="flex-1 flex flex-col justify-center items-center border rounded-lg bg-zinc-100"><span>Select chat to start chatting</span></div> : <Chats />} */}
            </div>
        </div>
    );
}

export default Home;
