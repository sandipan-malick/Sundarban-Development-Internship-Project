const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    quantity: { type: Number, required: true },
    bookedAt: { type: Date, default: Date.now },
    bookingDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    placeName: { type: String },
    placePrice: { type: Number },
    placeImage: { type: String },
    placeDescription: { type: String },
    placeRating: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
