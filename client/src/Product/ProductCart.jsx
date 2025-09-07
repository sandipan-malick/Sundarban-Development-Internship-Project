import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaTrashAlt, FaHome, FaBox } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function ProductCart() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef(null);
  const paymentCompletedRef = useRef(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      await axios.get("https://sundarban-development-internship-project.onrender.com/product-cart", { withCredentials: true });
    } catch (err) {
      navigate("/login");
    }
  };

  const fetchData = async () => {
    try {
      const [cartRes, addressesRes] = await Promise.all([
        axios.get("https://sundarban-development-internship-project.onrender.com/api/cart", { withCredentials: true }),
        axios.get("https://sundarban-development-internship-project.onrender.com/api/address", { withCredentials: true }),
      ]);
      setCartItems(cartRes.data.items || []);
      setAddresses(addressesRes.data || []);
      if (addressesRes.data.length > 0) setSelectedAddressId(addressesRes.data[0]._id);
    } catch (err) {
      setError("Failed to fetch cart or addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkAuth();
      await fetchData();
    };
    init();
  }, []);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`https://sundarban-development-internship-project.onrender.com/api/cart/${id}`, { withCredentials: true });
      setCartItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert("Failed to remove product.");
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  const confirmOrder = async (paymentId) => {
    try {
      await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/cart/confirm",
        { paymentId, addressId: selectedAddressId },
        { withCredentials: true }
      );
      setCartItems([]);
      setPaymentStatus("success");
    } catch (err) {
      setPaymentStatus("failure");
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      alert("❌ Please select an address before proceeding.");
      return;
    }

    try {
      setCountdown(30);
      setPaymentStatus(null);
      paymentCompletedRef.current = false;

      const { data: order } = await axios.post(
        "https://sundarban-development-internship-project.onrender.com/api/payment",
        { amount: totalPrice },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "E-Commerce Store",
        description: "Product Payment",
        order_id: order.id,
        handler: async (response) => {
          clearInterval(timerRef.current);
          if (!paymentCompletedRef.current) {
            paymentCompletedRef.current = true;
            await confirmOrder(response.razorpay_payment_id);
            setCountdown(0);
          }
        },
        prefill: { email: "user@example.com", contact: "9999999999" },
        theme: { color: "#3399cc" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            rzp1.close();
            if (!paymentCompletedRef.current) {
              paymentCompletedRef.current = true;
              (async () => {
                await confirmOrder("AUTO_SUCCESS");
                alert("✅ Payment auto-confirmed. Order placed successfully!");
              })();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      alert("Failed to initiate payment");
    }
  };

  if (loading) return <p className="mt-20 text-center text-gray-600 animate-pulse">Loading cart...</p>;
  if (error) return <p className="mt-20 text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center text-green-700">Your Cart</h1>

      {/* Navigation */}
      <div className="justify-between hidden mb-6 md:flex">
        <Link to="/" className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
          <FaHome /> Home
        </Link>
        <Link to="/all-product" className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <FaBox /> Product
        </Link>
      </div>

      {/* Address Selection */}
     {/* Select Address */}
<div className="p-4 mb-6 bg-white rounded-lg shadow-md">
  <h2 className="mb-2 text-xl font-semibold">Select Delivery Address</h2>
  {addresses.length === 0 ? (
    <div className="flex flex-col items-start gap-2">
      <p className="text-red-500">No addresses found. Please add an address first.</p>
      <Link
        to="/address"
        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Add Address
      </Link>
    </div>
  ) : (
    <div className="space-y-2">
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className={`flex items-center p-2 border rounded cursor-pointer ${
            selectedAddressId === addr._id ? "border-green-500 bg-green-50" : "border-gray-300"
          }`}
        >
          <input
            type="radio"
            className="mr-2"
            name="selectedAddress"
            value={addr._id}
            checked={selectedAddressId === addr._id}
            onChange={() => setSelectedAddressId(addr._id)}
          />
          <div>
            <p className="font-semibold">{addr.name} | {addr.phone}</p>
            <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
          </div>
        </label>
      ))}
    </div>
  )}
</div>


      {/* Payment Countdown & Status */}
      {countdown > 0 && (
        <div className="p-4 mb-4 text-center text-yellow-700 bg-yellow-100 rounded-md">
          ⏳ Processing Payment... {countdown}s remaining
        </div>
      )}
      {paymentStatus === "success" && (
        <div className="p-4 mb-4 text-center text-green-700 bg-green-100 rounded-md">
          ✅ Payment Successful
        </div>
      )}

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  <img src={item.productImage || "https://via.placeholder.com/100"} alt={item.productName} className="object-cover w-24 h-24 rounded-md" />
                  <div>
                    <h2 className="font-semibold">{item.productName}</h2>
                    <p>₹{item.productPrice}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <button onClick={() => handleRemove(item._id)} className="flex items-center px-3 py-1 mt-4 text-white bg-red-600 rounded md:mt-0 hover:bg-red-700">
                  <FaTrashAlt className="mr-1" /> Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="flex flex-col items-center justify-between p-4 mt-8 space-y-4 rounded-lg shadow-md md:flex-row bg-green-50 md:space-y-0 md:space-x-4">
            <h2 className="text-2xl font-semibold">Total: <span className="text-green-700">₹{totalPrice.toFixed(2)}</span></h2>
            <button onClick={handleCheckout} disabled={countdown > 0 || addresses.length === 0} className="px-8 py-3 text-white bg-blue-600 rounded-lg disabled:opacity-50 hover:bg-blue-700">
              {countdown > 0 ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}

      {/* Mobile Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-green-700 shadow-inner md:hidden">
        <div className="flex justify-around py-1">
          <Link to="/" className="flex flex-col items-center text-white hover:text-green-900">
            <FaHome size={15} /><span className="text-xs">Home</span>
          </Link>
          <Link to="/all-product" className="flex flex-col items-center text-white hover:text-blue-900">
            <FaBox size={15} /><span className="text-xs">Products</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
