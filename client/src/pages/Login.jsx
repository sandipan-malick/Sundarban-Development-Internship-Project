// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { signInWithGooglePopup } from "../firebase";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/user/login",
        form,
        { withCredentials: true }
      );

      console.log("Login successful:", res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const googleUser = await signInWithGooglePopup();
      const profile = googleUser.user;

      const res = await axios.post("http://localhost:5080/api/user/google-login", {
        email: profile.email,
        username: profile.displayName,
      },
        { withCredentials: true } 
    );

      console.log("Google login success:", res.data);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.error || "Google login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 👇 Top Banner */}
      <div className="w-full py-6 text-center text-white bg-gradient-to-r bg-forest-green">
        <h1 className="mb-2 text-3xl font-bold">🌿 Welcome Back to Sundarban Tours</h1>
        <p className="text-lg">Login to continue your journey through the mangroves.</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left side (Login Form) */}
        <div className="flex items-center justify-center w-full bg-gray-100 md:w-1/2">
          <div className="w-full max-w-md p-10 bg-white rounded-lg shadow-md backdrop-blur-md">
            <h2 className="mb-6 text-2xl font-semibold text-center text-black">Login</h2>

            {error && (
              <div className="mb-4 text-sm text-center text-red-500">{error}</div>
            )}

            {/* Normal Login */}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full py-2 text-black bg-transparent border-b border-gray-400 outline-none placeholder-violet-500 focus:border-blue-400"
              />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full py-2 text-black bg-transparent border-b border-gray-400 outline-none placeholder-violet-500 focus:border-blue-400"
              />
              <button
                type="submit"
                className="w-full py-2 font-medium text-gray-900 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
              >
                Login
              </button>
            </form>

            <div className="my-6 text-sm text-center text-black">OR</div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center w-full gap-2 py-2 font-medium text-gray-900 bg-white border border-gray-400 rounded-md hover:bg-gray-100"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>

            <p className="mt-6 text-sm text-center text-black">
              Don’t have an account?{" "}
              <Link to="/register" className="text-blue-400 hover:underline">
                Register
              </Link>
              <br />
              <Link
                to="/login/forgetPassword"
                className="text-blue-400 hover:underline"
              >
                Forget Password
              </Link>
            </p>
          </div>
        </div>

        {/* Right side (Background Image) */}
        <div
          className="relative items-center justify-center hidden w-1/2 bg-center bg-cover md:flex"
          style={{
            backgroundImage:
              "url('https://miro.medium.com/1*gcm8bMiTmvS5Dm9hDzKk5g.jpeg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>
    </div>
  );
}

export default Login;
