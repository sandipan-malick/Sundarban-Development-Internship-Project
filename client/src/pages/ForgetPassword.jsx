// src/pages/ForgetPassword.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5080/api/user/forgot-password",
        { email }
      );

      setMessage(res.data.message);
      navigate("/forget/otp/verify", { state: { userData: { email } } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-zinc-900 to-black">
      {/* Glassmorphic Card */}
      <div className="w-full max-w-md p-8 border shadow-lg rounded-2xl bg-white/10 backdrop-blur-md border-white/20">
        <h2 className="mb-4 text-3xl font-bold text-center text-white">
          Forgot Password?
        </h2>
        <p className="mb-6 text-center text-green-300">
          Enter your registered email and we’ll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Your Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-12 px-4 text-white placeholder-gray-300 border rounded-md border-white/30 bg-white/10 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-12 px-4 rounded-md font-semibold tracking-wide transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed text-white"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md"
            }`}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-green-400">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-sm text-center text-red-400">{error}</p>
        )}

        <p className="mt-6 text-sm text-center text-gray-300">
          Remember your password?{" "}
          <Link to="/login" className="text-green-400 hover:underline">
            Go to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgetPassword;
