import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "watchtower",
    description: "",
    image: "",
    price: "",
    rating: "",
    location: "",
    roomsAvailable: "",
  });

  const navigate = useNavigate();

  // Check admin authentication
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await axios.get("https://sundarban-development-internship-project.onrender.com/dashboard-admin", {
          withCredentials: true,
        });
      } catch (err) {
        navigate("/admin-login");
      }
    };
    checkAdminAuth();
  }, [navigate]);

  // Fetch all places
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get("https://sundarban-development-internship-project.onrender.com/api/places");
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new place
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/places",
        {
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
          roomsAvailable: Number(form.roomsAvailable),
        },
        { withCredentials: true }
      );
      fetchPlaces();
      setForm({
        name: "",
        type: "watchtower",
        description: "",
        image: "",
        price: "",
        rating: "",
        location: "",
        roomsAvailable: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error adding place");
    }
  };

  // Delete a place
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sundarban-development-internship-project.onrender.com/api/places/${id}`, {
        withCredentials: true,
      });
      setPlaces((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting place");
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto font-sans">
      <h1 className="mb-6 text-3xl font-bold text-center text-blue-700">
        Admin Dashboard
      </h1>

      {/* Add Place Form */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Add New Place
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="watchtower">Watchtower</option>
            <option value="homestay">Homestay</option>
            <option value="spot">Spot</option>
            <option value="boat">Boat</option>
            <option value="guide">Guide</option>
            <option value="tour">Tour</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Rating"
            value={form.rating}
            step="0.1"
            min="0"
            max="5"
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder="Rooms Available"
            value={form.roomsAvailable}
            onChange={(e) =>
              setForm({ ...form, roomsAvailable: e.target.value })
            }
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="col-span-1 p-2 border rounded-md md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
          <button
            type="submit"
            className="col-span-1 p-3 font-semibold text-white transition bg-blue-600 rounded-md md:col-span-2 hover:bg-blue-700"
          >
            Add Place
          </button>
        </form>
      </div>

      {/* List of Places */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          All Places
        </h2>
        {places.length === 0 ? (
          <p className="text-gray-500">No places found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {places.map((p) => (
              <div
                key={p._id}
                className="p-4 transition border rounded-lg shadow-sm hover:shadow-md bg-gray-50"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="object-cover w-full h-40 mb-2 rounded-md"
                  />
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.type}</p>
                <p className="text-sm text-gray-600">Location: {p.location}</p>
                <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
                <p className="text-sm text-gray-600">
                  Rating: {parseFloat(p.rating).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">
                  Available: {p.roomsAvailable}
                </p>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="w-full p-2 mt-2 text-white transition bg-red-500 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
