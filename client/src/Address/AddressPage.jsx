import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHome, FaArrowLeft } from "react-icons/fa";

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

  // 🔹 Fetch addresses
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

  // 🔹 GPS Autofill
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

  // 🔹 Add / Update Address
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

  // 🔹 Edit Address
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

  // 🔹 Delete Address
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
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Loading addresses...
      </p>
    );

  if (error)
    return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl p-4 mx-auto min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* 🔹 Mobile Top Bar */}
      <div className="flex items-center justify-between mb-6 md:hidden bg-green-700 px-4 py-3 rounded shadow">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-800 rounded-lg hover:bg-green-900 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-800 rounded-lg hover:bg-green-900 transition-colors"
        >
          <FaHome /> Home
        </Link>
      </div>

      {/* 🔹 Desktop Top Nav */}
      <div className="justify-between hidden mb-6 md:flex bg-green-700 px-6 py-4 rounded shadow">
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold"
        >
          <FaHome /> Home
        </Link>
      </div>

      <h1 className="mb-8 text-3xl font-extrabold text-center text-green-900 sm:text-4xl tracking-tight drop-shadow-md">
        My Addresses
      </h1>

      {/* 🔹 Address Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 mb-10 bg-white rounded-xl shadow-lg max-w-3xl mx-auto"
      >
        <h2 className="mb-6 text-xl font-semibold text-green-800 sm:text-2xl">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            pattern="[\d\s+-]{7,15}"
            title="Enter a valid phone number"
            required
          />
          <input
            type="text"
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="col-span-2 p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            required
          />
          <input
            type="text"
            placeholder="PIN Code"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition"
            required
            pattern="\d{4,10}"
            title="Enter a valid postal code"
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 active:scale-95 transition-transform"
          >
            {editId ? "Update Address" : "Add Address"}
          </button>
          <button
            type="button"
            onClick={handleUseLocation}
            className="w-full sm:w-auto px-6 py-3 text-white bg-green-600 rounded-lg shadow hover:bg-green-700 active:scale-95 transition-transform"
          >
            Use My Location
          </button>
        </div>
      </form>

      {/* 🔹 Address List */}
      <div className="max-w-3xl mx-auto space-y-5">
        {addresses.length === 0 && (
          <p className="text-center text-gray-600 italic">
            No addresses added yet.
          </p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex flex-col justify-between gap-4 p-5 bg-white rounded-xl shadow-lg sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-semibold text-green-900 text-lg">
                {addr.name} | {addr.phone}
              </p>
              <p className="text-green-800/90">
                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-2">
              <button
                onClick={() => handleEdit(addr)}
                className="px-5 py-2 text-white bg-yellow-500 rounded-lg shadow hover:bg-yellow-600 active:scale-95 transition transform"
                aria-label={`Edit address of ${addr.name}`}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="px-5 py-2 text-white bg-red-600 rounded-lg shadow hover:bg-red-700 active:scale-95 transition transform"
                aria-label={`Delete address of ${addr.name}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Mobile Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-3">
          <Link
            to="/"
            className="flex flex-col items-center text-white hover:text-green-200"
            aria-label="Navigate to Home"
          >
            <FaHome size={22} />
            <span className="text-xs">Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
