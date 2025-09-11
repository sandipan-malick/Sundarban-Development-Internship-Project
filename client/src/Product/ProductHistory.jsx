import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaHome, FaBox } from "react-icons/fa";

export default function ProductHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //  Protected Route: check if user is logged in
  const checkAuth = async () => {
    try {
      await axios.get("https://sundarban-development-internship-project.onrender.com/product-history", {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Auth check error:", err);
      navigate("/login");
    }
  };

  // Fetch product order history
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://sundarban-development-internship-project.onrender.com/api/cart/history", {
        withCredentials: true,
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError("Failed to load order history. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchOrders();
    };
    init();
  }, []);

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Loading order history...
      </p>
    );
  if (error)
    return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-bold text-center text-blue-700">
        Order History
      </h1>
      <div className="justify-between hidden mb-6 md:flex ">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/all-product"
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <FaBox /> Product
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order._id} className="p-4 bg-white rounded-lg shadow-md">
              <p className="mb-2 text-sm font-semibold text-gray-600">
                Order Date:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="mb-2 text-sm font-semibold text-gray-600">
                Total Amount: ₹{order.totalAmount}
              </p>
              <p className="mb-4 text-sm font-semibold text-gray-600">
                Delivery Address:{" "}
                {order.address
                  ? `${order.address.name}, ${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zip}`
                  : "N/A"}
              </p>

              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-4 rounded-lg shadow-sm bg-gray-50"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/300"}
                      alt={item.name}
                      className="object-cover w-full h-40 mb-3 rounded-md"
                    />
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500">Price: ₹{item.price}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="mt-1 font-semibold text-green-700">
                      Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-1">
          <Link to="/" className="flex flex-col items-center text-white hover:text-green-900">
            <FaHome size={15} />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/all-data" className="flex flex-col items-center text-white hover:text-blue-900">
            <FaBox size={15} />
            <span className="text-xs">Activites</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
