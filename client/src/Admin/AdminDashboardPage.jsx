// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu toggle
  const navigate = useNavigate();

  // -----------------------------
  // Check if admin is logged in
  // -----------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("https://sundarban-development-internship-project.onrender.com/admin-dashboard", {
          withCredentials: true,
        });
        setAdmin(res.data);
      } catch (err) {
        navigate("/admin-login");
      }
    };
    checkAuth();
  }, [navigate]);

  // -----------------------------
  // Logout handler
  // -----------------------------
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/admin/logout",
        {},
        { withCredentials: true }
      );
      navigate("/admin-login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="text-white bg-blue-600 shadow-lg">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 text-xl font-bold">Admin Panel</div>

            {/* Desktop Menu */}
            <div className="items-center hidden space-x-6 md:flex">
              <Link to="/admin" className="">Activity</Link>
              <Link to="/admin-booking" className="">Booking</Link>
              <Link to="/admin-order" className="">Order</Link>
              <Link to="/admin-education" className="">Education</Link>
              <Link to="/admin-product" className="">Product</Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="focus:outline-none focus:ring-2 focus:ring-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="px-4 pt-2 pb-4 space-y-2 bg-blue-700 md:hidden">
            <Link to="/admin" className="block " onClick={() => setMenuOpen(false)}>Activity</Link>
            <Link to="/admin-booking" className="block" onClick={() => setMenuOpen(false)}>Booking</Link>
            <Link to="/admin-order" className="block" onClick={() => setMenuOpen(false)}>Order</Link>
            <Link to="/admin-education" className="block" onClick={() => setMenuOpen(false)}>Education</Link>
            <Link to="/admin-product" className="block" onClick={() => setMenuOpen(false)}>Product</Link>
            <button
              onClick={handleLogout}
              className="w-full px-3 py-1 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="p-6 mx-auto max-w-7xl">
        {admin ? (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">
              Welcome, <span className="text-blue-600">{admin.email}</span>
            </h2>
            <p className="text-gray-600">
              Use the navigation menu to manage activities, bookings, orders, education content, and products.
            </p>
          </div>
        ) : (
          <p className="mt-10 text-center text-gray-600 animate-pulse">Loading...</p>
        )}
      </main>
    </div>
  );
}
