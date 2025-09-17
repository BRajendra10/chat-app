import React, { useState } from 'react'
import { LuSearch } from "react-icons/lu";

function Search() {
    const [query, setQuery] = useState("");
    console.log(query);
    
    return (
        <div className="min-w-[15rem] w-[25rem] h-fit grid grid-cols-12 bg-white shadow-lg rounded-xl py-1 px-3">
            <div className="col-span-1 flex justify-start items-center">
                <LuSearch className="text-xl" />
            </div>
            <input className="col-span-11 w-full outline-none rounded-sm py-2 px-3" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text" name="search-chats" id="search-chats" placeholder="Search chats" />
        </div>
    )
}

export default Search