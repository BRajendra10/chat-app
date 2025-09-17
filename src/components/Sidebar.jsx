import React from 'react'
import { useSelector } from "react-redux";
import Chat from "./Chat";
import Search from "./Search";

function Sidebar() {
    const { users, currentUser } = useSelector((state) => state.users);

    return (
        <div className="w-[22rem] bg-zinc-100 border rounded-lg flex flex-col">
            {/* Search */}
            <div className="h-[4rem] p-2 flex items-center border-gray-200">
                <Search />
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {users.map((el) => (
                    el.uid !== currentUser.uid && <Chat
                        key={el.id}
                        user={{
                            avatar: el.photoURL,
                            name: el.displayName,
                            lastMessage: "Hey!",
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default Sidebar