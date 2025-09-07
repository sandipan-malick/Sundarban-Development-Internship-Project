import React, { useState } from "react";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://sundarban-development-internship-project.onrender.com/api/admin/login",
        { email, password },
        { withCredentials: true }
      );
      setMsg("✅ Login successful");
      window.location.href = "/admin-dashboard-page";
    } catch (err) {
      setMsg("❌ Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded-lg shadow-md w-96">
        <h2 className="mb-6 text-2xl font-bold text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded outline-none"
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-600 rounded outline-none hover:bg-blue-700"
        >
          Login
        </button>
        {msg && <p className="mt-3 text-center">{msg}</p>}
      </form>
    </div>
  );
}
