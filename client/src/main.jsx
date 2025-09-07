import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <App />
    </LoadScript>
  </React.StrictMode>
);
