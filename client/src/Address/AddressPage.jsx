// src/pages/AddressPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios"; // ✅ use central axios instance
import { FaHome } from "react-icons/fa";

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

  // 🔹 Fetch addresses from backend
  const loadAddresses = async () => {
    try {
      const res = await axios.get("/api/address");
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

  // 🔹 Auth check + fetch addresses
  useEffect(() => {
    loadAddresses();
  }, []);

  // ======= Use GPS to auto-fill address =======
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
            `/api/location/reverse?lat=${latitude}&lon=${longitude}`
          );

          const address = res.data.address || {};

          const street =
            address.road ||
            address.residential ||
            address.quarter ||
            address.hamlet ||
            address.locality ||
            address.suburb ||
            address.neighbourhood ||
            address.pedestrian ||
            address.cycleway ||
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

  // 🔹 Handle form submit (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
      };

      if (editId) {
        await axios.put(`/api/address/${editId}`, payload);
        alert("Address updated!");
      } else {
        await axios.post("/api/address", payload);
        alert("Address added!");
      }

      // Reset form
      setForm({ name: "", phone: "", street: "", city: "", state: "", zip: "" });
      setEditId(null);

      // Refresh list
      loadAddresses();
    } catch (err) {
      console.error("Address submit error:", err);

      if (err.response?.data?.error) {
        alert("Error: " + err.response.data.error);
      } else {
        alert("Failed to save address. Check console for details.");
      }
    }
  };

  // 🔹 Handle edit
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
  };

  // 🔹 Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`/api/address/${id}`);
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
    <div className="max-w-4xl p-6 mx-auto">
      {/* Top Home Button (Desktop only) */}
      <div className="justify-between hidden mb-6 md:flex ">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg outline-none hover:bg-green-700"
        >
          <FaHome /> Home
        </Link>
      </div>

      <h1 className="mb-6 text-3xl font-bold text-center text-green-700">
        My Addresses
      </h1>

      {/* Address Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 mb-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-4 text-xl font-semibold">
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
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded outline-none hover:bg-blue-700"
          >
            {editId ? "Update Address" : "Add Address"}
          </button>
          <button
            type="button"
            onClick={handleUseLocation}
            className="px-4 py-2 text-white bg-green-600 rounded outline-none hover:bg-green-700"
          >
            Use My Location
          </button>
        </div>
      </form>

      {/* Address List */}
      <div className="grid gap-4">
        {addresses.length === 0 && (
          <p className="text-center text-gray-500">No addresses added yet.</p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md"
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
                className="px-3 py-1 text-white bg-yellow-500 rounded outline-none hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="px-3 py-1 text-white bg-red-600 rounded outline-none hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Mobile Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-3">
          <Link
            to="/"
            className="flex flex-col items-center text-white hover:text-green-900"
          >
            <FaHome size={22} />
            <span className="text-xs">Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
