import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function DetailedSundarbansMap() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      await axios.get("https://sundarban-development-internship-project.onrender.com/ecoTourism", {
        withCredentials: true,
      });
      setLoading(false); // Authenticated, allow access
    } catch (err) {
      console.error("User not authenticated:", err);
      navigate("/login"); // redirect to login if not authenticated
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <p className="mt-20 text-center text-gray-600 animate-pulse">
        Checking authentication...
      </p>
    );
  }

  // Watchtowers
  const watchtowers = [
    { id: 1, name: "Sajnekhali Watchtower", lat: 21.8985, lng: 88.8681 },
    { id: 2, name: "Dobanki Watchtower", lat: 21.928, lng: 88.895 },
    { id: 3, name: "Lothian Watchtower", lat: 21.91, lng: 88.85 },
    { id: 4, name: "Bagerhat Watchtower", lat: 21.94, lng: 88.88 },
    { id: 5, name: "Gosaba Watchtower", lat: 21.86, lng: 88.92 },
  ];

  // Rivers / Boat Routes
  const river1 = [
    [21.8985, 88.8681],
    [21.905, 88.875],
    [21.91, 88.885],
    [21.92, 88.89],
  ];

  const river2 = [
    [21.928, 88.895],
    [21.935, 88.9],
    [21.94, 88.91],
    [21.95, 88.92],
  ];

  // Tourist spots
  const spots = [
    { id: 1, name: "Sundarbans Homestay", lat: 21.912, lng: 88.872 },
    { id: 2, name: "Eco Boat Station", lat: 21.93, lng: 88.898 },
  ];

  return (
    <div className="relative p-0 mx-auto max-w-7xl">
      {/* Page Title */}
      <h1 className="my-4 text-3xl font-bold text-center text-green-700">
        Sundarbans Detailed Map
      </h1>

      {/* Go button */}
   <div className="flex justify-center gap-4 mb-4">
  {/* Go button */}
  <button
    onClick={() => window.open("https://www.google.com/maps", "_blank")}
    className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
  >
    Go
  </button>

  {/* Home button */}
  <Link
    to="/"
    className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
  >
    <FaHome size={20} />
    <span className="hidden sm:inline">Home</span>
  </Link>
</div>


      {/* Map Section */}
      <MapContainer
        center={[21.91, 88.868]}
        zoom={12}
        style={{ height: "650px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Watchtower markers */}
        {watchtowers.map((tower) => (
          <Marker key={tower.id} position={[tower.lat, tower.lng]}>
            <Popup>
              <strong>{tower.name}</strong>
              <br />
              Location: {tower.lat.toFixed(4)}, {tower.lng.toFixed(4)}
              <br />
              Type: Watchtower
            </Popup>
          </Marker>
        ))}

        {/* Tourist spots */}
        {spots.map((spot) => (
          <Marker key={spot.id} position={[spot.lat, spot.lng]}>
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              Location: {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
              <br />
              Type: Tourist Spot
            </Popup>
          </Marker>
        ))}

        {/* Rivers / routes */}
        <Polyline positions={river1} color="blue" weight={4} />
        <Polyline positions={river2} color="cyan" weight={4} />
      </MapContainer>

      {/* Footer Navbar (Small devices only) */}
    </div>
  );
}
