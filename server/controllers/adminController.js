const Booking = require("../models/Booking");
const BookingConfirmation = require("../models/BookingConfirmation");
const Address = require("../models/Address");
const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ===========================
// Get all cart bookings
// ===========================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name email");
    res.json(bookings);
  } catch (err) {
    console.error("Fetch all bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// ===========================
// Get all confirmed bookings
// ===========================
exports.getAllConfirmedBookings = async (req, res) => {
  try {
    const confirmations = await BookingConfirmation.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(confirmations);
  } catch (err) {
    console.error("Fetch all confirmed bookings error:", err);
    res.status(500).json({ error: "Failed to fetch confirmed bookings" });
  }
};

// ===========================
// Get all addresses
// ===========================
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find().populate("userId", "name email");
    res.json(addresses);
  } catch (err) {
    console.error("Fetch all addresses error:", err);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Create JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Send token as cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({ message: "Login successful", email: admin.email });
  } catch (err) {
    console.error("❌ Admin login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Admin logout
// @route POST /api/admin/logout
// @access Private
exports.logoutAdmin = (req, res) => {
  res.clearCookie("adminToken");
  res.json({ message: "Logout successful" });
};
