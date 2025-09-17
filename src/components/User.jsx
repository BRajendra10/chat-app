import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function UserCard({ click }) {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.users);
    const { isClicked, setIsClicked } = click;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("✅ Logged out");
            navigate("/login");
        } catch (error) {
            console.error("❌ Logout error:", error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setIsClicked(!isClicked)}>
            <div className="bg-white rounded-2xl shadow-2xl w-[22rem] p-6 relative">
                {/* Close button (optional) */}
                <button className="absolute top-3 right-3 hover:text-gray-600" onClick={() => setIsClicked(!isClicked)}>✖</button>

                <div className="flex flex-col items-center text-center">
                    {/* Avatar with gradient ring */}
                    <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-sky-400">
                        <img
                            src={
                                currentUser.photoURL ||
                                `https://ui-avatars.com/api/?name=${currentUser.displayName || "User"
                                }&size=100&background=f97316&color=fff`
                            }
                            alt="user avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>

                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                        {currentUser.displayName || "No Name"}
                    </h2>
                    <p className="text-gray-500 text-sm">{currentUser.email}</p>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-200 my-4"></div>

                    <div className="flex flex-col gap-3 w-full">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserCard;
