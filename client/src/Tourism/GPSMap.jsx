import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Routing machine via global L
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

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

// Routing component
function Routing({ userPos, destination }) {
  const map = useMap();

  useEffect(() => {
    if (!userPos || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(userPos[0], userPos[1]), L.latLng(destination[0], destination[1])],
      routeWhileDragging: true,
      showAlternatives: false,
      lineOptions: { styles: [{ color: "blue", weight: 5 }] },
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, userPos, destination]);

  return null;
}

// Click on map to set destination
function MapClickHandler({ setDestination }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => setDestination([e.latlng.lat, e.latlng.lng]);
    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, setDestination]);

  return null;
}

export default function GPSMap() {
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);

  // Get user GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.error("GPS Error:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position || [22.5726, 88.3639]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {position && (
          <Marker position={position}>
            <Popup>You are here 📍</Popup>
          </Marker>
        )}

        {destination && (
          <Marker position={destination}>
            <Popup>Destination 📍</Popup>
          </Marker>
        )}

        {position && destination && <Routing userPos={position} destination={destination} />}

        <MapClickHandler setDestination={setDestination} />
      </MapContainer>
    </div>
  );
}
