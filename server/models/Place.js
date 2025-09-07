const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["watchtower", "homestay", "spot", "boat", "guide", "tour"],
    required: true,
  },
  description: { type: String },
  image: { type: String },
  price: { type: String },
  rating: { type: String },
  location: { type: String },
  roomsAvailable: { type: Number, default: 0 },
});

module.exports = mongoose.model("Place", placeSchema);
