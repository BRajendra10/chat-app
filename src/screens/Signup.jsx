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
});

function Signup() {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    values.email,
                    values.password
                );

                // generating random user image
                const randomNum = Math.floor(Math.random() * 99) + 1;
                const genders = ['men', 'women'];
                const randomGender = genders[Math.floor(Math.random() * genders.length)];
                const randomAvatar = `https://randomuser.me/api/portraits/${randomGender}/${randomNum}.jpg`;
                // Update profile with username once
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
                // Reload to make sure local user object updates
                await userCredential.user.reload();

                navigate("/");
            } catch (error) {
                console.error("❌ Error signing up:", error.message);
            }

            formik.resetForm();
        },
    });

    const { errors, values, touched } = formik;

    return (
        <div className="w-[30rem] h-fit flex flex-col items-center bg-white shadow-xl rounded-xl p-5">
            <h1 className="text-2xl font-semibold mb-5">Signup</h1>

            <form action="" className="w-full h-fit flex flex-col" onSubmit={formik.handleSubmit}>
                <label className="text-base my-2" htmlFor="name">
                    Username
                </label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="text"
                    name="username"
                    id="username"
                    onChange={formik.handleChange}
                    value={values.username}
                />
                {touched.username && errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                )}

                <label className="text-base my-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="email"
                    name="email"
                    id="email"
                    onChange={formik.handleChange}
                    value={values.email}
                />
                {touched.email && errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}

                <label className="text-base my-2" htmlFor="Password">
                    Password
                </label>
                <input
                    className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
                    type="password"
                    name="password"
                    id="password"
                    onChange={formik.handleChange}
                    value={values.password}
                />
                {touched.password && errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                )}

                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-lg p-3 mt-10" type="submit">
                    Sign up
                </button>

                {/* <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg mt-5 transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google logo"
                        className="w-6 h-6"
                    />
                    Continue with Google
                </button> */}

                <NavLink className="text-center text-blue-500 mt-5 underline" to={"/login"}>already have a account? login</NavLink>
            </form>
        </div>
    );
}

export default Signup;
