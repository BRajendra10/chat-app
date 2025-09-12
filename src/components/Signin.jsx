import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // make sure you export auth from firebase.js
import { signInWithEmailAndPassword } from "firebase/auth";

function Signin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSignin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in:", userCredential.user);
        } catch (err) {
            setError(err.message);
        }

        navigate("/user");
    };

    return (
        <div className="w-[30rem] h-fit flex flex-col items-center bg-white shadow-xl rounded-xl p-5">
            <h2 className="text-2xl font-semibold mb-5">Sign In</h2>
            <form onSubmit={handleSignin} className="w-full h-fit flex flex-col">
                <label className="text-base my-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    placeholder="Email"
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label className="text-base my-2" htmlFor="Password">
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded-lg text-lg p-3 mt-8"
                >
                    Sign In
                </button>

                <NavLink className="text-center text-blue-500 mt-5 underline" to={"/signup"}>don't  have a account </NavLink>
            </form>
        </div>
    );
}

export default Signin;
