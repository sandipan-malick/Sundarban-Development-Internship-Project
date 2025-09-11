import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminBooking() {
  const [bookings, setBookings] = useState([]);
  const [confirmed, setConfirmed] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        //  Check admin authentication
        await axios.get("https://sundarban-development-internship-project.onrender.com/admin-booking", { withCredentials: true });

        //  Fetch admin data
        const [bRes, cRes, aRes] = await Promise.all([
          axios.get("https://sundarban-development-internship-project.onrender.com/api/admin/bookings", { withCredentials: true }),
          axios.get("https://sundarban-development-internship-project.onrender.com/api/admin/confirmed", { withCredentials: true }),
          axios.get("https://sundarban-development-internship-project.onrender.com/api/admin/addresses", { withCredentials: true }),
        ]);

        setBookings(bRes.data);
        setConfirmed(cRes.data);
        setAddresses(aRes.data);
      } catch (err) {
        console.error("Admin auth/data fetch error:", err);
        navigate("/admin-login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p className="mt-20 text-center">Loading admin data...</p>;

  return (
    <div className="max-w-6xl p-6 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-blue-700">Admin Panel</h1>

      {/* All Cart Bookings */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">All Cart Bookings</h2>
        {bookings.length === 0 ? (
          <p>No cart bookings</p>
        ) : (
          bookings.map((b, index) => (
            <div key={`${b._id}-${index}`} className="flex items-center gap-4 p-4 mb-2 border rounded">
              <img
                src={b.placeImage || "https://via.placeholder.com/100"}
                alt={b.placeName}
                className="w-24 h-24 rounded-md"
              />
              <div>
                <p>User: {b.userId?.name} ({b.userId?.email})</p>
                <p>Place: {b.placeName}</p>
                <p>Quantity: {b.quantity}</p>
                <p>Price: ₹{b.placePrice}</p>
              </div>
            </div>
          ))
        )}
      </section>

      {/* All Confirmed Bookings */}
      <section className="mb-10">
        <h2 className="mb-4 text-2xl font-semibold">All Confirmed Bookings</h2>
        {confirmed.length === 0 ? (
          <p>No confirmed bookings</p>
        ) : (
          confirmed.map((c, cIndex) => (
            <div key={`${c._id}-${cIndex}`} className="p-4 mb-2 border rounded">
              <p className="font-semibold">User: {c.userId?.name} ({c.userId?.email})</p>
              <p>Total Amount: ₹{c.totalAmount}</p>
              <p>Payment ID: {c.paymentId}</p>
              <p>Address: {c.address?.street}, {c.address?.city}, {c.address?.state} - {c.address?.zip}</p>
              <p className="mt-2 font-semibold">Bookings:</p>
              <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3">
                {c.bookings.map((b, bIndex) => (
                  <div key={`${b.placeId}-${bIndex}`} className="flex flex-col items-center p-2 border rounded">
                    <img
                      src={b.placeImage || "https://via.placeholder.com/150"}
                      alt={b.placeName}
                      className="w-32 h-32 mb-2 rounded-md"
                    />
                    <p>{b.placeName} x {b.quantity}</p>
                    <p>₹{b.placePrice}</p>
                    <p>Booking Date: {new Date(b.bookingDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* All Addresses */}
      <section>
        <h2 className="mb-4 text-2xl font-semibold">All Addresses</h2>
        {addresses.length === 0 ? (
          <p>No addresses added</p>
        ) : (
          addresses.map((a, aIndex) => (
            <div key={`${a._id}-${aIndex}`} className="p-4 mb-2 border rounded">
              <p className="font-semibold">User: {a.userId?.name} ({a.userId?.email})</p>
              <p>{a.name} | {a.phone}</p>
              <p>{a.street}, {a.city}, {a.state} - {a.zip}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
