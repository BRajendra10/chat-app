import React from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { NavLink, useNavigate } from "react-router-dom";

import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";

const schema = object({
    username: string().required("Username is required"),
    email: string().required("Email is required").email("Invalid email"),
    password: string().required("Password is required").min(8, "At least 8 characters"),
    avatarGender: string().required("Please select your avatar gender"),
});

function Signup() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            avatarGender: "", // men or women
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );

                // Generate random avatar based on selected gender
                const randomNum = Math.floor(Math.random() * 99) + 1;
                const randomAvatar = `https://randomuser.me/api/portraits/${values.avatarGender}/${randomNum}.jpg`;

                // Update profile with username and avatar
                await updateProfile(userCredential.user, {
                    displayName: values.username,
                    photoURL: randomAvatar
                });

                // Save to Firestore
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    uid: userCredential.user.uid,
                    displayName: values.username,
                    email: values.email,
                    photoURL: randomAvatar,
                    online: true,
                    createdAt: new Date()
                });

                await userCredential.user.reload();
                navigate("/");
            } catch (error) {
                console.error("❌ Error signing up:", error.message);
            }

            formik.resetForm();
        },
    });

    const { errors, values, touched, handleChange, handleBlur } = formik;

    return (
        <div className="w-[30rem] h-fit flex flex-col items-center bg-white shadow-xl rounded-xl p-5">
            <h1 className="text-2xl font-semibold mb-5">Signup</h1>

            <form className="w-full h-fit flex flex-col" onSubmit={formik.handleSubmit}>
                <label className="text-base my-2">Username</label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="text"
                    name="username"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.username}
                />
                {touched.username && errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                )}

                <label className="text-base my-2">Email</label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                />
                {touched.email && errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <label className="text-base my-2">Password</label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                />
                {touched.password && errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <label className="text-base my-2">Select Avatar Gender</label>
                <div className="flex gap-4 mb-5">
                    {["men", "women"].map((gender) => (
                        <label key={gender} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="avatarGender"
                                value={gender}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                checked={values.avatarGender === gender}
                                className="cursor-pointer"
                            />
                            <span className="capitalize">{gender}</span>
                        </label>
                    ))}
                </div>
                {touched.avatarGender && errors.avatarGender && (
                    <p className="text-red-500 text-sm">{errors.avatarGender}</p>
                )}

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg p-3 mt-5"
                    type="submit"
                >
                    Sign up
                </button>

                <NavLink
                    className="text-center text-blue-500 mt-5 underline"
                    to={"/login"}
                >
                    Already have an account? Login
                </NavLink>
            </form>
        </div>
    );
}

export default Signup;
