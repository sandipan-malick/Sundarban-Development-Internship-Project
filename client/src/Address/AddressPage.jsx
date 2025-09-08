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

  const loadAddresses = async () => {
    try {
      const res = await axios.get(
        "https://sundarban-development-internship-project.onrender.com/api/address",
        { withCredentials: true }
      );
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      if (err.response?.status === 401) navigate("/login");
      else setError("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation is not supported.");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(
            `https://sundarban-development-internship-project.onrender.com/api/location/reverse?lat=${latitude}&lon=${longitude}`,
            { withCredentials: true }
          );
          const address = res.data.address || {};
          setForm((prev) => ({
            ...prev,
            street: address.road || address.residential || "",
            city: address.city || address.town || "",
            state: address.state || "",
            zip: address.postcode || "",
          }));
        } catch {
          alert("Failed to fetch address from GPS");
        }
      },
      () => alert("Failed to get your location. Allow GPS access.")
    );
  };

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
      alert(err.response?.data?.error || "Failed to save address.");
    }
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(
        `https://sundarban-development-internship-project.onrender.com/api/address/${id}`,
        { withCredentials: true }
      );
      setAddresses(addresses.filter((a) => a._id !== id));
    } catch {
      alert("Failed to delete address.");
    }
  };

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-500 animate-pulse text-lg">
        Loading addresses...
      </p>
    );
  if (error)
    return (
      <p className="mt-20 text-center text-red-500 text-lg">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800 transition"
        >
          <FaArrowLeft /> Back
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-green-700 rounded-lg hover:bg-green-800 transition"
        >
          <FaHome /> Home
        </Link>
      </div>

      <div className="hidden md:flex justify-between mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          <FaHome /> Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
        My Addresses
      </h1>

      {/* Form Card */}
      <div className="p-6 mb-8 bg-white rounded-2xl shadow-lg border border-green-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          {editId ? "Edit Address" : "Add New Address"}
        </h2>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          {[
            { placeholder: "Full Name", key: "name" },
            { placeholder: "Phone", key: "phone" },
            { placeholder: "Street", key: "street", col: "col-span-2" },
            { placeholder: "City", key: "city" },
            { placeholder: "State", key: "state" },
            { placeholder: "PIN Code", key: "zip" },
          ].map((f) => (
            <input
              key={f.key}
              type="text"
              placeholder={f.placeholder}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              className={`p-3 border rounded-lg outline-none focus:ring-2 focus:ring-green-400 ${f.col || ""}`}
              required
            />
          ))}
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {editId ? "Update Address" : "Add Address"}
            </button>
            <button
              type="button"
              onClick={handleUseLocation}
              className="flex-1 px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            >
              <FaMapMarkerAlt /> Use My Location
            </button>
          </div>
        </form>
      </div>

      {/* Address List */}
      <div className="grid gap-5">
        {addresses.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No addresses added yet.
          </p>
        )}
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition"
          >
            <div>
              <p className="font-semibold text-lg">{addr.name}</p>
              <p className="text-gray-600">{addr.phone}</p>
              <p className="text-gray-700 mt-1">
                {addr.street}, {addr.city}, {addr.state} - {addr.zip}
              </p>
            </div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <button
                onClick={() => handleEdit(addr)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(addr._id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Bottom Nav */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-3">
          <Link
            to="/"
            className="flex flex-col items-center text-white hover:text-green-200 transition"
          >
            <FaHome size={22} />
            <span className="text-xs">Home</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
