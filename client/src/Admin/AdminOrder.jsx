// src/pages/AdminOrder.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Check admin authentication
  // -----------------------------
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        await axios.get("https://sundarban-development-internship-project.onrender.com/admin-education", {
          withCredentials: true,
        });
      } catch (err) {
        navigate("/admin-login"); // Redirect if not admin
      }
    };
    checkAdminAuth();
  }, [navigate]);

  // -----------------------------
  // Fetch all orders
  // -----------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "https://sundarban-development-internship-project.onrender.com/api/cart/admin-order",
          { withCredentials: true }
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Fetch admin orders error:", err);
        setError("Failed to load orders. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Loading all orders...
      </p>
    );

  if (error)
    return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="mb-8 text-4xl font-bold text-center text-purple-700">
        Admin – All Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-4 bg-white rounded-lg shadow-md"
            >
              <p className="text-sm text-gray-600">
                Order ID: <span className="font-mono">{order._id}</span>
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Customer:{" "}
                {order.user
                  ? `${order.user.name} (${order.user.email})`
                  : "Guest"}
              </p>
              <p className="text-sm text-gray-600">
                Total Amount: ₹{order.totalAmount}
              </p>
              <p className="mb-4 text-sm text-gray-600">
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
                      Subtotal: ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
