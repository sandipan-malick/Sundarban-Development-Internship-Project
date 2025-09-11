const mongoose = require("mongoose");

const bookingConfirmationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookings: [
      {
        placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        placeName: String,
        placePrice: Number,
        quantity: Number,
        placeImage: { type: String, default: "https://via.placeholder.com/150" },
        placeDescription: String,
        placeRating: Number,
        bookingTime: { type: Date, default: Date.now },
        bookingDate: { type: Date, required: true },
      },
    ],
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    address: {
      type: {
        name: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zip: String,
      },
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookingConfirmation", bookingConfirmationSchema);
