import React from 'react'

function Chats() {
    return (
        <div className="flex-1 flex flex-col justify-center items-center border rounded-lg bg-zinc-100">
            {/* Chat Header */}
            <div className="w-full h-[5rem] flex items-center gap-3 px-5 border rounded-t-lg border-gray-200 bg-white shadow-sm">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <span className="text-sm text-gray-700">
                    Select a chat to start messaging
                </span>
            </div>

            {/* Messages */}
            <div className="w-full flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl shadow max-w-xs">
                        Hello! This is a received message
                    </div>
                </div>
                <div className="flex justify-end">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl shadow max-w-xs">
                        Hi! This is a sent message
                    </div>
                </div>
            </div>

            {/* Input */}
            <div className="w-full h-[4.5rem] px-5 flex items-center rounded-b-lg border-gray-200 bg-white">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg outline-none placeholder-gray-400"
                />
                <button className="ml-3 bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-full text-sm text-white">
                    Send message
                </button>
            </div>
        </div>
    )
}

export default Chats