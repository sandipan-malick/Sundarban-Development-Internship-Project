// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!emailFromState) {
      navigate("/login");
    }
  }, [emailFromState, navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!newPassword.trim()) {
      return setError("❌ New password is required.");
    }

    if (newPassword.length < 6) {
      return setError("❌ Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/user/reset-password",
        { email, newPassword }
      );

      setMessage(res.data.message || "Password successfully reset.");
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black">
      <div className="w-full max-w-md p-8 text-white border shadow-2xl rounded-2xl backdrop-blur-lg bg-white/10 border-white/20">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
          Reset Your Password
        </h2>

        <form className="flex flex-col space-y-5" onSubmit={handleReset}>
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 mt-1 text-gray-400 border border-gray-700 rounded-lg cursor-not-allowed h-11 bg-gray-800/50 focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 mt-1 border border-gray-700 rounded-lg h-11 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full h-11 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            }`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="mt-5 text-sm text-center text-green-400">{message}</p>
        )}
        {error && (
          <p className="mt-5 text-sm text-center text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
