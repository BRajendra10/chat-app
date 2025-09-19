import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { LuSearch } from "react-icons/lu";
import Chat from "./Chat";

function Sidebar() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState([]);
    const { users } = useSelector((state) => state.users);
    const { currentUser } = useSelector((state) => state.users);

    useEffect(() => {
        if (query) {
            const results = users.filter((user) => user.displayName.toLowerCase().includes(query.toLowerCase()));
            setResult(results);
        }
    }, [query, users])

    return (
        <div className="w-[22rem] bg-zinc-100 border rounded-lg flex flex-col">
            {/* Search */}
            <div className="w-full h-[4.5rem] flex justify-center items-center bg-none p-2">
                <div className="w-[20rem] h-[3.3rem] bg-white rounded-lg shadow-lg p-2 flex">
                    <div className="col-span-1 flex justify-start items-center">
                        <LuSearch className="text-xl" />
                    </div>
                    <input className="col-span-11 w-full outline-none rounded-sm py-2 px-3"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        type="text" name="search-chats" id="search-chats" placeholder="Search chats" />
                </div>
            </div>

            {/* Users list */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {result.length > 0 ? result.map((el) => (
                    el.uid !== currentUser.uid && <Chat
                        key={el.uid}
                        user={el}
                    />
                )) : users.map((el) => (
                    el.uid !== currentUser.uid && <Chat
                        key={el.uid}
                        user={el}
                    />
                ))}
            </div>
        </div>
    )
}

export default React.memo(Sidebar);