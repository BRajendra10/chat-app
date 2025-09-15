import React from "react";
import { useFormik } from "formik";
import { object, string } from "yup";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, NavLink } from "react-router-dom";

const schema = object({
  email: string().required("Email is required").email("Invalid email"),
  password: string().required("Password is required"),
});

function Signin() {
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        console.log("User logged in:", userCredential.user);
        navigate("/");
      } catch (error) {
        setErrors({ general: error.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("✅ Google user:", result.user);
      navigate("/");
    } catch (error) {
      console.error("❌ Google login error:", error.message);
    }
  };

  return (
    <div className="w-[30rem] h-fit flex flex-col items-center bg-white shadow-xl rounded-xl p-5">
      <h2 className="text-2xl font-semibold mb-5">Sign In</h2>

      <form onSubmit={formik.handleSubmit} className="w-full h-fit flex flex-col">
        <label className="text-base my-2">Email</label>
        <input
          type="email"
          className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
          {...formik.getFieldProps("email")}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-sm">{formik.errors.email}</p>
        )}

        <label className="text-base my-2">Password</label>
        <input
          type="password"
          className="bg-zinc-100 outline-zinc-900 rounded-sm px-2 py-3 mb-1"
          {...formik.getFieldProps("password")}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-sm">{formik.errors.password}</p>
        )}

        {formik.errors.general && (
          <p className="text-red-500 text-sm">{formik.errors.general}</p>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg text-lg p-3 mt-8"
          disabled={formik.isSubmitting}
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg mt-5 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google logo"
            className="w-6 h-6"
          />
          Continue with Google
        </button>

        <NavLink className="text-center text-blue-500 mt-5 underline" to={"/signup"}>
          Don't have an account
        </NavLink>
      </form>
    </div>
  );
}

export default Signin;
