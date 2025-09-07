import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaHome, FaListUl } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function BookingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await axios.get("https://sundarban-development-internship-project.onrender.com/history", {
        withCredentials: true,
      });
    } catch (err) {
      console.error("User not authenticated:", err);
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await checkAuth();
        const res = await axios.get("https://sundarban-development-internship-project.onrender.com/api/booking/history", {
          withCredentials: true,
        });
        setHistory(res.data || []);
      } catch (err) {
        console.error("Fetch history error:", err);
        setError("Failed to load booking history. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Loading booking history...
      </p>
    );
  if (error)
    return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-bold text-center text-green-700">
        Booking History
      </h1>

      {/* Top Nav (md+) */}
      <div className="justify-between hidden mb-6 md:flex">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/all-data"
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaListUl /> Activities
        </Link>
      </div>

      {history.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-8 pb-20">
          {history.map((confirmation) => (
            <div
              key={confirmation._id}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <p className="mb-2 text-sm font-semibold text-gray-600">
                Booking Date:{" "}
                {new Date(confirmation.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-4 text-sm font-semibold text-gray-600">
                Total Amount: ₹{confirmation.totalAmount}
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {confirmation.bookings.map((b, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <img
                      src={b.placeImage || "https://via.placeholder.com/300"}
                      alt={b.placeName}
                      className="object-cover w-full h-40 mb-3 rounded-md"
                    />
                    <h2 className="text-lg font-semibold">{b.placeName}</h2>
                    <p className="text-sm text-gray-500">{b.placeDescription}</p>
                    <div className="flex items-center mt-1 text-yellow-500">
                      <FaStar className="mr-1" />
                      <span>{b.placeRating || "N/A"}</span>
                    </div>
                    <p className="mt-1 font-semibold text-green-700">
                      ₹{b.placePrice} / night
                    </p>
                    <p className="text-sm text-gray-500">Quantity: {b.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Nav (mobile only) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-3">
          <Link to="/" className="flex flex-col items-center text-white hover:text-green-900">
            <FaHome size={22} />
            <span className="text-xs">Home</span>
          </Link>
          <Link
            to="/all-data"
            className="flex flex-col items-center text-white hover:text-blue-900"
          >
            <FaListUl size={22} />
            <span className="text-xs">Activities</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
