import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 via-white to-green-100">
      <div className="p-8 text-center">
        {/* Big 404 with gradient text */}
        <h1 className="font-extrabold text-transparent text-9xl bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 animate-pulse">
          404
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! Page not found
        </p>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-block px-6 py-3 mt-6 font-medium text-white transition duration-300 transform bg-green-600 rounded-lg shadow-md hover:bg-green-700 hover:scale-105"
        >
          ⬅ Back to Home
        </Link>

        {/* Decorative wave */}
        <div className="mt-10">
          <svg
            className="w-full h-24 text-green-200"
            fill="currentColor"
            viewBox="0 0 1440 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,128L40,154.7C80,181,160,235,240,250.7C320,267,400,245,480,202.7C560,160,640,96,720,74.7C800,53,880,75,960,106.7C1040,139,1120,181,1200,192C1280,203,1360,181,1400,170.7L1440,160L1440,320L0,320Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
