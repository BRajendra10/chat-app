import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function UserCard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("✅ Logged out");
        } catch (error) {
            console.error("❌ Logout error:", error.message);
        }

        navigate("/login")
    };

    if (!user) {
        return (
            <div className="p-5 text-center text-gray-500">
                No user logged in
            </div>
        );
    }

    return (
        <div className="w-[20rem] bg-white shadow-lg rounded-xl p-5 flex flex-col items-center">
            <img
                src={"https://i.pravatar.cc/100"} // fallback avatar
                alt="user avatar"
                className="w-20 h-20 rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold">{user.displayName || "No Name"}</h2>
            <p className="text-gray-600">{user.email}</p>
            <button
                onClick={handleLogout}
                className="mt-5 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
                Logout
            </button>
        </div>
    );
}

export default UserCard;
