import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHome, FaArrowLeft, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Fetch addresses
  const loadAddresses = async () => {
    try {
      const res = await axios.get(
        "https://sundarban-development-internship-project.onrender.com/api/address",
        { withCredentials: true }
      );
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load addresses.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  // GPS Autofill
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://sundarban-development-internship-project.onrender.com/api/location/reverse?lat=${latitude}&lon=${longitude}`,
            { withCredentials: true }
          );

          const address = res.data.address || {};
          const street =
            address.road ||
            address.residential ||
            address.quarter ||
            address.locality ||
            address.suburb ||
            address.neighbourhood ||
            address.path ||
            "";
          const city =
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            "";

          setForm((prev) => ({
            ...prev,
            street,
            city,
            state: address.state || "",
            zip: address.postcode || "",
          }));
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          alert("Failed to fetch address from GPS");
        }
      },
      (err) => {
        console.error(err);
        alert("Failed to get your location. Allow GPS access.");
      }
    );
  };

  // Add / Update Address
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };

      if (editId) {
        await axios.put(
          `https://sundarban-development-internship-project.onrender.com/api/address/${editId}`,
          payload,
          { withCredentials: true }
        );
        alert("Address updated!");
      } else {
        await axios.post(
          "https://sundarban-development-internship-project.onrender.com/api/address",
          payload,
          { withCredentials: true }
        );
        alert("Address added!");
      }

      setForm({ name: "", phone: "", street: "", city: "", state: "", zip: "" });
      setEditId(null);
      loadAddresses();
    } catch (err) {
      console.error("Address submit error:", err);
      alert(err.response?.data?.error || "Failed to save address.");
    }
  };

  // Edit Address
  const handleEdit = (address) => {
    setForm({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zip: address.zip,
    });
    setEditId(address._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Address
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(
        `https://sundarban-development-internship-project.onrender.com/api/address/${id}`,
        { withCredentials: true }
      );
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address.");
    }
  };

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse text-lg">
        Loading addresses...
      </p>
    );
  if (error)
    return (
      <p className="mt-20 text-center text-red-600 font-semibold text-lg">{error}</p>
    );

  return (
    <div className="max-w-5xl p-6 mx-auto min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg shadow hover:bg-green-800 transition"
          aria-label="Go back"
        >
          <FaArrowLeft /> Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-green-700 rounded-lg shadow hover:bg-green-800 transition"
          aria-label="Go home"
        >
          <FaHome /> Home
        </Link>
      </div>

      {/* Desktop Top Nav */}
      <div className="hidden mb-8 md:flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-3 px-5 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition"
          aria-label="Go home"
        >
          <FaHome size={20} /> Home
        </Link>
        <h1 className="text-3xl font-extrabold text-green-800 tracking-wide">
          My Addresses
        </h1>
        <div /> {/* Empty div for spacing */}
      </div>

      {/* Heading for mobile */}
      <h1 className="mb-6 text-3xl font-extrabold text-center text-green-800 md:hidden">
        My Addresses
      </h1>

      {/* Address Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 mb-10 bg-white rounded-xl shadow-lg max-w-3xl mx-auto"
        aria-label={editId ? "Edit Address Form" : "Add New Address Form"}
      >
        <h2 className="mb-6 text-2xl font-semibold text-green-700 border-b border-green-200 pb-2">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="Full Name"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="Phone Number"
            pattern="^\+?[0-9\s\-]{7,15}$"
            title="Enter a valid phone number"
          />
          <input
            type="text"
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="col-span-2 p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="Street Address"
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="City"
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="State"
          />
          <input
            type="text"
            placeholder="PIN Code"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-label="PIN Code"
            pattern="^\d{4,10}$"
            title="Enter a valid PIN code"
          />
        </div>
        <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:justify-between">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
            aria-label={editId ? "Update Address" : "Add Address"}
          >
            {editId ? "Update Address" : "Add Address"}
          </button>
          <button
            type="button"
            onClick={handleUseLocation}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition font-semibold"
            aria-label="Use My Location"
          >
            <FaMapMarkerAlt /> Use My Location
          </button>
        </div>
      </form>

      {/* Address List */}
      <section
        className="max-w-4xl mx-auto"
        aria-label="List of saved addresses"
      >
        {addresses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg italic">
            No addresses added yet.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {addresses.map((addr) => (
              <li
                key={addr._id}
                className="flex flex-col justify-between p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div>
                  <p className="text-lg font-semibold text-green-800">
                    {addr.name} <span className="text-sm font-normal text-gray-600">| {addr.phone}</span>
                  </p>
                  <p className="mt-1 text-gray-700">
                    {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                  </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="flex items-center gap-2 px-4 py-2 text-yellow-700 bg-yellow-100 rounded-lg shadow hover:bg-yellow-200 transition font-semibold"
                    aria-label={`Edit address for ${addr.name}`}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-100 rounded-lg shadow hover:bg-red-200 transition font-semibold"
                    aria-label={`Delete address for ${addr.name}`}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Mobile Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden z-50">
        <nav className="flex justify-around py-3">
          <Link
            to="/"
            className="flex flex-col items-center text-white hover:text-green-200 transition"
            aria-label="Home"
          >
            <FaHome size={24} />
            <span className="text-xs mt-1 font-semibold">Home</span>
          </Link>
        </nav>
      </footer>
    </div>
  );
}
