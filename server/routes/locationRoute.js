const express = require("express");
const axios = require("axios");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Reverse geocode using OpenStreetMap
router.get("/reverse", authMiddleware, async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude required" });
  }

  try {
    const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
      params: {
        format: "jsonv2",
        lat,
        lon,
        addressdetails: 1,
      },
      headers: {
        "Accept": "application/json",
        "User-Agent": "MyApp/1.0 (your_email@example.com)", // ✅ safe on server-side
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Reverse geocoding error:", err.message);
    res.status(500).json({ error: "Failed to fetch address from GPS" });
  }
});

module.exports = router;
