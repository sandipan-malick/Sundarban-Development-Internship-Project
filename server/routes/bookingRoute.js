const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  deleteBooking,
  confirmBooking,
  clearCart,
  getBookingHistory,
} = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// POST a new booking
router.post("/", authMiddleware, createBooking);

// GET all bookings for logged in user
router.get("/", authMiddleware, getBookings);

// Cancel booking
router.delete("/:id", authMiddleware, deleteBooking);

//confirm booking should be POST (not GET)
router.post("/confirm", authMiddleware, confirmBooking);

// Clear cart manually
router.delete("/clear", authMiddleware, clearCart);

// Booking history page

router.get("/history", authMiddleware, getBookingHistory);

module.exports = router;
