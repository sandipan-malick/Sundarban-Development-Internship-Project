// src/pages/AdminProductDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminProductDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("products"); // future tabs if needed
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "dress",
    description: "",
    image: "",
    price: "",
    rating: "",
    stock: "",
  });

  // -----------------------------
  // Check admin authentication
  // -----------------------------
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await axios.get(
          "https://sundarban-development-internship-project.onrender.com/admin-product-dashboard",
          { withCredentials: true }
        );
      } catch (err) {
        navigate("/admin-login");
      }
    };
    checkAdminAuth();
  }, [navigate]);

  // -----------------------------
  // Fetch all products
  // -----------------------------
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://sundarban-development-internship-project.onrender.com/api/product",
        { withCredentials: true }
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // -----------------------------
  // Add new product
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/product",
        {
          ...form,
          price: Number(form.price),
          rating: Number(form.rating),
          stock: Number(form.stock),
        },
        { withCredentials: true }
      );
      fetchProducts();
      setForm({
        name: "",
        category: "dress",
        description: "",
        image: "",
        price: "",
        rating: "",
        stock: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error adding product");
    }
  };

  // -----------------------------
  // Delete a product
  // -----------------------------
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://sundarban-development-internship-project.onrender.com/api/product/${id}`,
        { withCredentials: true }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Error deleting product");
    }
  };

  return (
    <div className="max-w-6xl p-6 mx-auto font-sans">
      <h1 className="mb-6 text-3xl font-bold text-center text-green-700">
        Admin Product Dashboard
      </h1>

      {/* Add Product Form */}
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          Add New Product
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="dress">Dress</option>
            <option value="food">Food</option>
            <option value="others">Others</option>
          </select>
          <input
            type="text"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Rating"
            value={form.rating}
            step="0.1"
            min="0"
            max="5"
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="number"
            placeholder="Stock Available"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="col-span-1 p-2 border rounded-md md:col-span-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          ></textarea>
          <button
            type="submit"
            className="col-span-1 p-3 font-semibold text-white transition bg-green-600 rounded-md md:col-span-2 hover:bg-green-700"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* List of Products */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700">
          All Products
        </h2>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
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
                <p className="text-sm text-gray-600">Category: {p.category}</p>
                <p className="text-sm text-gray-600">Price: ₹{p.price}</p>
                <p className="text-sm text-gray-600">
                  Rating: {parseFloat(p.rating).toFixed(1)}
                </p>
                <p className="text-sm text-gray-600">Stock: {p.stock}</p>
                <p className="text-sm text-gray-600">{p.description}</p>
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

export default AdminProductDashboard;
