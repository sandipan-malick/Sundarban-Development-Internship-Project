import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaStar,
  FaHome,
  FaHistory,
  FaShoppingCart,
  FaBox,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function AllPlaces() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const currentPath = useLocation().pathname;

  // Filters
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [location, setLocation] = useState("");

  // Quantity and booking dates
  const [quantities, setQuantities] = useState({});
  const [bookingDates, setBookingDates] = useState({});

  // Check auth
  const checkAuth = async () => {
    try {
      await axios.get("https://sundarban-development-internship-project.onrender.com/all-data", {
        withCredentials: true,
      });
    } catch (err) {
      console.error("User not authenticated:", err);
      navigate("/login");
    }
  };

  // Fetch places
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        await checkAuth();
        const res = await axios.get("https://sundarban-development-internship-project.onrender.com/api/places", {
          withCredentials: true,
        });
        setPlaces(res.data || []);
        setFilteredPlaces(res.data || []);

        const initialQuantities = {};
        const initialDates = {};
        (res.data || []).forEach((place) => {
          initialQuantities[place._id] = 1;
          initialDates[place._id] = new Date().toISOString().split("T")[0];
        });
        setQuantities(initialQuantities);
        setBookingDates(initialDates);
      } catch (err) {
        console.error("Fetch places error:", err);
        setError("Failed to load places. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, [navigate]);

  // Filtering logic
  useEffect(() => {
    let filtered = places;
    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }
    if (maxPrice > 0) {
      filtered = filtered.filter((p) => (p.price || 0) <= maxPrice);
    }
    if (location.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    setFilteredPlaces(filtered);
  }, [minRating, maxPrice, location, places]);

  // Book
  const handleBook = async (placeId) => {
    const quantity = quantities[placeId] || 1;
    const bookingDate = bookingDates[placeId];
    try {
      const res = await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/booking",
        { placeId, quantity, bookingDate },
        { withCredentials: true }
      );
      alert(`Booking successful! Quantity: ${quantity} | Date: ${bookingDate}`);
      console.log("Booking:", res.data);
    } catch (err) {
      console.error("Booking error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to book place.");
    }
  };

  // Quantity change
  const handleQuantityChange = (placeId, value) => {
    setQuantities((prev) => ({
      ...prev,
      [placeId]: Math.max(1, value),
    }));
  };

  // Date change
  const handleDateChange = (placeId, date) => {
    setBookingDates((prev) => ({
      ...prev,
      [placeId]: date,
    }));
  };

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Loading places...
      </p>
    );
  if (error)
    return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <nav className="justify-center hidden gap-6 mb-6 md:flex">
        <Link className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700" to="/">
          <FaHome /> Home
        </Link>
        <Link className="flex items-center gap-2 px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700" to="/product-history">
          <FaHistory /> History
        </Link>
        <Link className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700" to="/product-cart">
          <FaShoppingCart /> Cart
        </Link>
        <Link className="flex items-center gap-2 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700" to="/all-product">
          <FaBox /> Product
        </Link>
      </nav>
      <h1 className="mb-8 text-4xl font-bold text-center text-green-700">
        Explore All Places
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-6 p-4 mb-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Min Rating</label>
          <select
            className="p-2 border rounded"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          >
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <option key={val} value={val}>
                {val === 0 ? "Any" : val + "★"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">
            Max Price (₹)
          </label>
          <input
            type="number"
            min={0}
            max={10000}
            step={100}
            className="w-32 p-2 border rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Location</label>
          <input
            type="text"
            placeholder="Search location"
            className="w-48 p-2 border rounded"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>

      {/* Places Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPlaces.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No places found matching filters.
          </p>
        ) : (
          filteredPlaces.map((place) => (
            <div
              key={place._id}
              className="flex flex-col p-4 transition bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-[1.02] duration-300"
            >
              <img
                src={place.image || "https://via.placeholder.com/300"}
                alt={place.name}
                className="object-cover w-full h-48 mb-4 rounded-md"
              />
              <h2 className="text-xl font-semibold">{place.name}</h2>
              <p className="text-sm text-gray-500">{place.type}</p>
              <p className="mt-2 text-gray-600">{place.description}</p>
              <div className="flex items-center mt-3 text-yellow-500">
                <FaStar className="mr-1" />
                <span>{place.rating || "N/A"}</span>
              </div>
              <p className="mt-2 font-semibold text-green-700">
                ₹{place.price} / night
              </p>
              <p className="text-sm text-gray-500">
                Location: {place.location || "Unknown"}
              </p>
              <p className="text-sm text-gray-500">
                Available: {place.roomsAvailable}
              </p>

              {/* Quantity & Date */}
              <div className="flex items-center gap-2 mt-3">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  max={place.roomsAvailable || 10}
                  value={quantities[place._id] || 1}
                  onChange={(e) =>
                    handleQuantityChange(place._id, Number(e.target.value))
                  }
                  className="w-16 p-1 text-center border rounded"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <label className="font-semibold">Booking Date:</label>
                <input
                  type="date"
                  value={bookingDates[place._id]}
                  onChange={(e) => handleDateChange(place._id, e.target.value)}
                  className="p-1 border rounded"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <button
                onClick={() => handleBook(place._id)}
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-md transition transform hover:scale-[1.03] duration-300"
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>

      {/* ✅ Footer Nav (Mobile) */}
      <footer className="fixed bottom-0 left-0 right-0 text-white bg-green-700  border-t shadow-lg md:hidden">
        <div className="flex justify-around p-2">
          {[
            { to: "/", icon: <FaHome />, label: "Home" },
            { to: "/history", icon: <FaHistory />, label: "History" },
            { to: "/cart", icon: <FaShoppingCart />, label: "Cart" },
            { to: "/all-product", icon: <FaBox />, label: "Product" },
            { to: "/address", icon: <FaMapMarkerAlt />, label: "Address" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition ${currentPath === link.to
                  ? "text-green-600 bg-green-100"
                  : "text-white hover:text-green-600"
                }`}
            >
              {link.icon}
              <span className="text-xs">{link.label}</span>
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
