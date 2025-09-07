const Place = require("../models/Place");

// Add Place
exports.addPlace = async (req, res) => {
  try {
    const { name, type, description, image, price, rating, location, roomsAvailable } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Missing required fields" });

    const place = new Place({ name, type, description, image, price, rating, location, roomsAvailable });
    await place.save();
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all places
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Place
exports.updatePlace = async (req, res) => {
  try {
    const updated = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Place
exports.deletePlace = async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: "Place deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
