const Booking = require("../models/Booking");
const Place = require("../models/Place");
const BookingConfirmation = require("../models/BookingConfirmation");
// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { placeId, quantity, bookingDate } = req.body;
    const userId = req.user?.userId;

    if (!placeId || !quantity || !bookingDate)
      return res.status(400).json({ error: "placeId, quantity and bookingDate are required" });
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const place = await Place.findById(placeId);
    if (!place) return res.status(404).json({ error: "Place not found" });

    if (place.roomsAvailable < quantity)
      return res.status(400).json({ error: "Not enough rooms available" });

    place.roomsAvailable -= quantity;
    await place.save();

    const booking = await Booking.create({
      placeId,
      quantity,
      userId,
      placeName: place.name,
      placePrice: place.price,
      placeImage: place.image,
      placeDescription: place.description,
      placeRating: place.rating,
      bookingDate, 
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Get bookings for logged-in user
exports.getBookings = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const bookings = await Booking.find({ userId });
    res.json({ bookings });
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Cancel a booking
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const booking = await Booking.findOne({ _id: bookingId, userId });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const place = await Place.findById(booking.placeId);
    if (place) {
      place.roomsAvailable += booking.quantity;
      await place.save();
    }

    await booking.deleteOne();
    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
// Confirm booking after payment
exports.confirmBooking = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { paymentId, addressId } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!addressId) return res.status(400).json({ error: "Address is required" });

    const address = await require("../models/Address").findById(addressId);
    if (!address) return res.status(404).json({ error: "Address not found" });

    // Fetch all cart items
    const cartItems = await Booking.find({ userId });
    if (!cartItems.length) return res.status(400).json({ error: "No cart items found" });

    // Prevent duplicate confirmation for same cart
    const existingConfirmation = await BookingConfirmation.findOne({
      userId,
      "bookings.placeId": { $all: cartItems.map((b) => b.placeId) },
      totalAmount: cartItems.reduce((sum, b) => sum + b.placePrice * b.quantity, 0),
    });

    if (existingConfirmation) {
      await Booking.deleteMany({ userId });
      return res.status(200).json({
        message: "Booking already confirmed previously",
        confirmation: existingConfirmation,
      });
    }

    // Map bookings
    const bookingsData = cartItems.map((item) => ({
      placeId: item.placeId,
      placeName: item.placeName,
      placePrice: item.placePrice,
      placeImage: item.placeImage || "https://via.placeholder.com/150",
      placeDescription: item.placeDescription,
      placeRating: item.placeRating,
      quantity: item.quantity,
      bookingDate: item.bookingDate
    }));

    // Calculate total
    const totalAmount = bookingsData.reduce((sum, b) => sum + b.placePrice * b.quantity, 0);

    // Save BookingConfirmation with selected address
    const confirmation = new BookingConfirmation({
      userId,
      bookings: bookingsData,
      paymentId: paymentId || "AUTO_SUCCESS",
      totalAmount,
      address: {
        name: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
      },
    });
    await confirmation.save();

    // Clear cart
    await Booking.deleteMany({ userId });

    res.json({
      message: "Booking confirmed successfully with address!",
      confirmation,
    });
  } catch (err) {
    console.error("Confirm booking error:", err);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
};
// Clear all cart data manually
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    await Booking.deleteMany({ userId });

    res.json({ message: "All cart data cleared" });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};
// Get booking history for logged-in user
exports.getBookingHistory = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Fetch all confirmed bookings
    const history = await BookingConfirmation.find({ userId }).sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error("Get booking history error:", err);
    res.status(500).json({ error: "Failed to fetch booking history" });
  }
};


