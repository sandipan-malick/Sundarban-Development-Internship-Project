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
    <div className="max-w-4xl p-4 mx-auto">
      {/* 🔹 Mobile Top Bar */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800"
        >
          <FaArrowLeft /> Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800"
        >
          <FaHome /> Home
        </Link>
      </div>

      {/* 🔹 Desktop Top Nav */}
      <div className="justify-between hidden mb-6 md:flex">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          <FaHome /> Home
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold text-center text-green-700 sm:text-3xl">
        My Addresses
      </h1>

      {/* 🔹 Address Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mb-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="p-2 border rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="Street"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="col-span-2 p-2 border rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="p-2 border rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="p-2 border rounded outline-none"
            required
          />
          <input
            type="text"
            placeholder="PIN Code"
            value={form.zip}
            onChange={(e) => setForm({ ...form, zip: e.target.value })}
            className="p-2 border rounded outline-none"
            required
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            type="submit"
            className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 sm:flex-none"
          >
            {editId ? "Update Address" : "Add Address"}
          </button>
          <button
            type="button"
            onClick={handleUseLocation}
            className="flex-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 sm:flex-none"
          >
            Use My Location
          </button>
        </div>
      </form>

      {/* 🔹 Address List */}
      <div className="grid gap-4">
        {addresses.length === 0 && (
          <p className="text-center text-gray-500">
            No addresses added yet.
          </p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex flex-col justify-between gap-3 p-4 bg-white rounded-lg shadow-md sm:flex-row sm:items-center"
          >
            <div>
              <p className="font-semibold">
                {addr.name} | {addr.phone}
              </p>
              <p>
                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(addr)}
                className="px-3 py-1 text-white bg-yellow-500 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
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
          >
            <FaHome size={22} />
            <span className="text-xs">Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
