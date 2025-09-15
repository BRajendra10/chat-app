import React from 'react'
import Chat from "./Chat";
import Search from "./Search";

function Sidebar() {
    return (
        <div className="w-[22rem] bg-zinc-100 border rounded-lg flex flex-col">
            {/* Search */}
            <div className="h-[4rem] p-2 flex items-center border-gray-200">
                <Search />
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <Chat
                    user={{
                        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
                        name: "Rohit",
                        lastMessage: "Hi, Rajendra",
                    }}
                />
                <Chat
                    user={{
                        avatar: "https://randomuser.me/api/portraits/men/34.jpg",
                        name: "Swapnil",
                        lastMessage: "Hey!",
                    }}
                />
            </div>
        </div>
    )
}

export default Sidebar